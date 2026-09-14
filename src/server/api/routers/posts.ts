import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { after } from "next/server";
import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  addUserDataToPosts,
  toPostAuthor,
} from "~/server/helpers/addUserDataToPosts";
import { ratelimiter } from "~/server/services/rateLimiter";
import { postContentSchema } from "~/utils/emoji";

export const postsRouter = createTRPCRouter({
  infinite: publicProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(50).default(20),
        // cursor is a reference to the last item in the previous batch
        // it's used to fetch the next batch
        cursor: z.string().nullish(),
        // when set, only posts from this author are returned (profile feed)
        authorId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input: { limit, cursor, authorId } }) => {
      const items = await ctx.db.post.findMany({
        where: { authorId },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        // `id` breaks ties between posts created at the same instant, keeping pages stable
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      });

      let nextCursor: string | undefined = undefined;
      if (items.length > limit) {
        // the extra item is the first one of the next batch
        nextCursor = items.pop()?.id;
      }

      return {
        posts: await addUserDataToPosts(items),
        nextCursor,
      };
    }),

  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input: { id } }) => {
      const post = await ctx.db.post.findUnique({
        where: {
          id,
        },
      });

      const [postWithAuthor] = post ? await addUserDataToPosts([post]) : [];

      if (!postWithAuthor)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });

      return postWithAuthor;
    }),

  create: privateProcedure
    .input(
      z.object({
        content: postContentSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { success, reset, pending } = await ratelimiter.limit(ctx.userId);
      // analytics are sent in the background, let them finish after the response
      after(() => pending);

      if (!success) {
        const seconds = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: `You're chirping too fast! Try again in ${seconds}s.`,
        });
      }

      const user = await (await clerkClient()).users.getUser(ctx.userId);
      const author = toPostAuthor(user);

      if (!author)
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Pick a username in your account settings before chirping.",
        });

      const post = await ctx.db.post.create({
        data: {
          authorId: ctx.userId,
          content: input.content,
        },
      });

      return { post, author };
    }),

  delete: privateProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { id } }) => {
      // scoping by author makes deleting someone else's post a no-op
      const { count } = await ctx.db.post.deleteMany({
        where: { id, authorId: ctx.userId },
      });

      if (count === 0)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });

      return { id };
    }),
});

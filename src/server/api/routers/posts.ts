import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { ratelimiter } from "~/server/services/rateLimiter";
import emojiRegex from "emoji-regex";
import { addUserDataToPosts } from "~/server/helpers/addUserDataToPosts";

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
      orderBy: [{ createdAt: "desc" }],
    });

    return addUserDataToPosts(posts);
  }),

  getByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(
      async ({ ctx, input }) =>
        await ctx.prisma.post
          .findMany({
            where: {
              authorId: input.userId,
            },
            take: 100,
            orderBy: {
              createdAt: "desc",
            },
          })
          .then(addUserDataToPosts)
    ),

  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input: { id } }) => {
      const post = await ctx.prisma.post.findUnique({
        where: {
          id,
        },
      });

      if (!post)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });

      return (await addUserDataToPosts([post]))[0];
    }),

  create: privateProcedure
    .input(
      z.object({
        content: z
          .string()
          .emoji("Only emojis are allowed!")
          .regex(emojiRegex(), "Only emojis are allowed!")
          .min(1)
          .max(280),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      const { success } = await ratelimiter.limit(authorId);

      if (!success)
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "You are doing that too much. Try again later.",
        });

      const post = await ctx.prisma.post.create({
        data: {
          authorId,
          content: input.content,
        },
      });

      return post;
    }),
});

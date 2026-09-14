import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  addUserDataToPosts,
  toPostAuthor,
} from "~/server/helpers/addUserDataToPosts";

export const profileRouter = createTRPCRouter({
  getUserByUsername: publicProcedure
    .input(
      z.object({
        username: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const {
        data: [user],
      } = await (
        await clerkClient()
      ).users.getUserList({
        // Clerk stores usernames in lowercase
        username: [input.username.toLowerCase()],
      });

      const author = user ? toPostAuthor(user) : null;

      if (!author)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });

      const postCount = await ctx.db.post.count({
        where: { authorId: author.id },
      });

      return { ...author, postCount };
    }),

  getRecentlyActive: publicProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(10).default(3),
      }),
    )
    .query(async ({ ctx, input: { limit } }) => {
      try {
        const latestPostPerAuthor = await ctx.db.post.findMany({
          distinct: ["authorId"],
          orderBy: { createdAt: "desc" },
          take: limit,
        });

        const posts = await addUserDataToPosts(latestPostPerAuthor);

        return posts.map(({ author }) => author);
      } catch (error) {
        // it only feeds a sidebar card, which shouldn't take the whole layout down with it
        console.error("Failed to load recently active authors", error);
        return [];
      }
    }),
});

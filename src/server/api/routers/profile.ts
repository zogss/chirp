import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";

export const profileRouter = createTRPCRouter({
  getUserByUsername: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ input }) => {
      const [users] = await clerkClient.users.getUserList({
        username: [input.username],
      });

      if (!users)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });

      return filterUserForClient(users);
    }),
});

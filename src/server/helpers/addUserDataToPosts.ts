import { clerkClient } from "@clerk/nextjs/server";
import type { Post } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { filterUserForClient } from "./filterUserForClient";

export const addUserDataToPosts = async (posts: Post[]) => {
  const userId = posts.map((post) => post.authorId);
  const users = (
    await clerkClient.users.getUserList({
      userId: userId,
      limit: 110,
    })
  ).map(filterUserForClient);

  return posts.map((post) => {
    const author = users.find((user) => user.id === post.authorId);

    if (!author) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Author for post not found. POST ID: ${post.id}, USER ID: ${post.authorId}`,
      });
    }
    if (!author.username) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Author for post has no username. POST ID: ${post.id}, USER ID: ${post.authorId}`,
      });
    }

    return {
      post,
      author: {
        ...author,
        username: author.username,
      },
    };
  });
};

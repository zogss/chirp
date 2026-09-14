import { clerkClient, type User } from "@clerk/nextjs/server";

import type { Post } from "~/generated/prisma/client";
import { filterUserForClient } from "./filterUserForClient";

/** Post authors need a username, it's what links a post to its author's profile. */
export const toPostAuthor = (user: User) => {
  const author = filterUserForClient(user);

  return author.username ? { ...author, username: author.username } : null;
};

export type PostAuthor = NonNullable<ReturnType<typeof toPostAuthor>>;

export const addUserDataToPosts = async (posts: Post[]) => {
  if (posts.length === 0) return [];

  const authorIds = [...new Set(posts.map((post) => post.authorId))];
  const { data: users } = await (
    await clerkClient()
  ).users.getUserList({
    userId: authorIds,
    limit: authorIds.length,
  });

  const authors = new Map<string, PostAuthor>();
  for (const user of users) {
    const author = toPostAuthor(user);
    if (author) authors.set(user.id, author);
  }

  return posts.flatMap((post) => {
    const author = authors.get(post.authorId);

    // A deleted Clerk account (or one without a username) shouldn't take the whole feed down,
    // so its posts are skipped instead of failing the request.
    if (!author) {
      console.warn(
        `Skipping post ${post.id}: author ${post.authorId} was not found or has no username`,
      );
      return [];
    }

    return [{ post, author }];
  });
};

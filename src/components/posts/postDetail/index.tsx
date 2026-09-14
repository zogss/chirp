"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";

import { Avatar } from "~/components/avatar";
import { Timestamp } from "~/components/timestamp";
import { useTRPC } from "~/trpc/react";
import { PostMenu } from "../postMenu";

interface PostDetailProps {
  id: string;
}

/** A single post, as shown on its own page. */
export const PostDetail = ({ id }: PostDetailProps) => {
  //* hooks
  const trpc = useTRPC();
  const {
    data: { post, author },
  } = useSuspenseQuery(trpc.posts.getById.queryOptions({ id }));

  //* render
  const profileHref = `/${author.username}`;

  return (
    <article className="border-b border-line px-4 pt-3">
      <div className="flex items-center gap-3">
        <Link
          href={profileHref}
          className="shrink-0 rounded-full transition-opacity hover:opacity-85"
        >
          <Avatar src={author.imageUrl} username={author.username} size={40} />
        </Link>
        <div className="min-w-0 flex-1 leading-5">
          <Link
            href={profileHref}
            className="block truncate font-bold hover:underline"
          >
            {author.displayName}
          </Link>
          <Link
            href={profileHref}
            tabIndex={-1}
            className="block truncate text-muted"
          >
            @{author.username}
          </Link>
        </div>
        <PostMenu post={post} author={author} />
      </div>
      <p className="mt-3 text-[40px] leading-[1.3] wrap-break-word whitespace-pre-wrap">
        {post.content}
      </p>
      <div className="py-4 text-muted">
        <Timestamp date={post.createdAt} variant="full" />
      </div>
    </article>
  );
};

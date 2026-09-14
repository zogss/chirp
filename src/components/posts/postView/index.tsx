"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";

import { Avatar } from "~/components/avatar";
import { Timestamp } from "~/components/timestamp";
import type { RouterOutputs } from "~/trpc/react";
import { PostMenu } from "../postMenu";

type PostWithAuthor = RouterOutputs["posts"]["getById"];

export const PostView = ({ post, author }: PostWithAuthor) => {
  //* hooks
  const router = useRouter();

  //* handlers
  const postHref = `/post/${post.id}`;
  const profileHref = `/${author.username}`;

  const openPost = (event: MouseEvent<HTMLElement>) => {
    const target = event.target as Element;

    // links, buttons and menus rendered in portals handle their own clicks
    if (!event.currentTarget.contains(target) || target.closest("a, button"))
      return;
    // don't navigate away while the user is selecting text
    if (window.getSelection()?.toString()) return;

    router.push(postHref);
  };

  //* render
  return (
    <motion.article
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="overflow-hidden border-b border-line"
    >
      <div
        onClick={openPost}
        className="flex cursor-pointer gap-3 px-4 py-3 transition-colors hover:bg-white/3"
      >
        <Link
          href={profileHref}
          className="shrink-0 self-start rounded-full transition-opacity hover:opacity-85"
        >
          <Avatar src={author.imageUrl} username={author.username} size={40} />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1 leading-5">
            <Link
              href={profileHref}
              className="min-w-0 truncate font-bold hover:underline"
            >
              {author.displayName}
            </Link>
            <Link
              href={profileHref}
              tabIndex={-1}
              className="min-w-0 truncate text-muted"
            >
              @{author.username}
            </Link>
            <span aria-hidden className="text-muted">
              ·
            </span>
            <Link
              href={postHref}
              className="shrink-0 text-muted hover:underline"
            >
              <Timestamp date={post.createdAt} />
            </Link>
            <PostMenu post={post} author={author} className="ml-auto" />
          </div>
          <p className="mt-0.5 text-2xl leading-8 wrap-break-word whitespace-pre-wrap">
            {post.content}
          </p>
        </div>
      </div>
    </motion.article>
  );
};

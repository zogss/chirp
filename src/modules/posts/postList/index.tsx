"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { AnimatePresence } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { useInView } from "react-intersection-observer";

import { LoadingSpinner } from "~/components/loading";
import { PostView } from "~/components/posts";
import { useTRPC } from "~/trpc/react";
import { feedInput, feedQueryOptions } from "../constants";

interface PostListProps {
  /** Only show posts from this author (profile feed). */
  authorId?: string;
  emptyState: ReactNode;
}

export const PostList = ({ authorId, emptyState }: PostListProps) => {
  //* hooks
  const trpc = useTRPC();
  const { ref, inView } = useInView({ rootMargin: "600px" });
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(
      trpc.posts.infinite.infiniteQueryOptions(
        feedInput(authorId),
        feedQueryOptions,
      ),
    );

  //* effects
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  //* render
  const posts = data.pages.flatMap((page) => page.posts);

  if (posts.length === 0) return emptyState;

  return (
    <div className="flex flex-col">
      <AnimatePresence initial={false}>
        {posts.map(({ post, author }) => (
          <PostView key={post.id} post={post} author={author} />
        ))}
      </AnimatePresence>
      {hasNextPage && (
        <div ref={ref}>{isFetchingNextPage && <LoadingSpinner />}</div>
      )}
    </div>
  );
};

import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { PostListSkeleton, PostView } from "~/components/posts";
import { api } from "~/utils/api";

interface ProfileFeedProps {
  userId: string;
}

export const ProfileFeed = ({ userId }: ProfileFeedProps) => {
  //* hooks
  const { ref, inView } = useInView();
  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    api.posts.infiniteScrollByUserId.useInfiniteQuery(
      { limit: 25, userId },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    );

  //* effects
  useEffect(() => {
    if (inView) {
      void fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  //* render
  if (isLoading) return <PostListSkeleton />;

  if (!data || data.pages.length === 0) return <div>User has no posts!</div>;

  return (
    <div className="flex grow flex-col">
      <AnimatePresence initial={false}>
        {data.pages.map((page) =>
          page.posts.map(({ post, author }) => (
            <PostView key={post.id} {...{ post, author }} />
          ))
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!!isFetchingNextPage && !!hasNextPage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex w-full items-center justify-center"
          >
            <PostListSkeleton items={3} />
          </motion.div>
        )}
      </AnimatePresence>
      <div ref={ref}> </div>
    </div>
  );
};

import React, { useEffect } from "react";
import { api } from "~/utils/api";
import { PostListSkeleton } from "~/components/posts/postSkeleton";

import { PostView } from "~/components/posts/postView";
import { AnimatePresence, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export const PostList = () => {
  //* hooks
  const { ref, inView } = useInView();
  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    api.posts.infiniteScroll.useInfiniteQuery(
      { limit: 25 },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    );

  //* effects
  useEffect(() => {
    if (inView) {
      void fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  //* render
  return (
    <div className="relative flex grow flex-col">
      {isLoading ? (
        <PostListSkeleton />
      ) : data && data.pages.length > 0 ? (
        <AnimatePresence initial={false}>
          {data.pages.map((page) =>
            page.posts.map(({ post, author }) => (
              <PostView key={post.id} {...{ post, author }} />
            ))
          )}
        </AnimatePresence>
      ) : (
        <span className="my-auto self-center">No posts found</span>
      )}
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

import React from "react";
import { api } from "~/utils/api";
import { PostListSkeleton } from "~/components/posts/postSkeleton";

import { PostView } from "~/components/posts/postView";
import { motion } from "framer-motion";

export const PostList = () => {
  //* hooks
  const { data, isLoading } = api.posts.getAll.useQuery();

  //* render
  return (
    <motion.div layout="size" className="flex grow flex-col">
      {isLoading ? (
        <PostListSkeleton />
      ) : data && data.length > 0 ? (
        data.map(({ post, author }) => (
          <PostView key={post.id} {...{ post, author }} />
        ))
      ) : (
        <span className="my-auto self-center">No posts found</span>
      )}
    </motion.div>
  );
};

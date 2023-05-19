import React from "react";
import { api } from "~/utils/api";
import { PostListSkeleton } from "../postSkeleton";

import { PostView } from "../postView";

export const PostList = () => {
  //* hooks
  const { data, isLoading } = api.posts.getAll.useQuery();

  //* render
  return (
    <div className="flex grow flex-col">
      {isLoading ? (
        <PostListSkeleton />
      ) : data ? (
        data.map(({ post, author }) => (
          <PostView key={post.id} {...{ post, author }} />
        ))
      ) : (
        <span className="my-auto self-center">No posts found</span>
      )}
    </div>
  );
};

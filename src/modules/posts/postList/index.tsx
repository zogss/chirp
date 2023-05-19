import React from "react";
import { LoadingSpinner } from "~/components/loading";
import { api } from "~/utils/api";

import { PostView } from "../postView";

export const PostList = () => {
  //* hooks
  const { data, isLoading } = api.posts.getAll.useQuery();

  //* render
  return (
    <div className="flex grow flex-col">
      {isLoading ? (
        <div className="my-auto self-center">
          <LoadingSpinner />
        </div>
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

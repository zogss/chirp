import React from "react";
import { PostListSkeleton, PostView } from "~/components/posts";
import { api } from "~/utils/api";

export const ProfileFeed = ({ userId }: { userId: string }) => {
  //* hooks
  const { data, isLoading } = api.posts.getPostsByUserId.useQuery({
    userId,
  });

  //* render
  if (isLoading) return <PostListSkeleton items={3} />;

  if (!data || data.length === 0) return <div>User has no posts!</div>;

  return (
    <div className="flex flex-col">
      {data.map(({ post, author }) => (
        <PostView key={post.id} {...{ post, author }} />
      ))}
    </div>
  );
};

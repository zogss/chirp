/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";

export const PostSkeleton = () => (
  <div>
    <div className="flex gap-3 border-b border-slate-400 p-4">
      <div className="h-12 w-12 animate-pulse rounded-full bg-gray-900" />
      <div className="flex w-full flex-col gap-2">
        <div className="flex gap-2">
          <span className="block h-4 w-20 animate-pulse bg-gray-900" />
          <div className="flex gap-1">
            <span className="block h-4 w-12 animate-pulse bg-gray-900" />
            <span className="block h-4 w-6 animate-pulse bg-gray-900" />
          </div>
        </div>
        <p className="h-4 w-2/3 animate-pulse bg-gray-900" />
      </div>
    </div>
  </div>
);

export const PostListSkeleton = () => (
  <div className="flex flex-col">
    {[...Array(10)].map((_, i) => (
      <PostSkeleton key={i} />
    ))}
  </div>
);

export const PostSkeleton = () => (
  <div className="flex gap-3 border-b border-line px-4 py-3" aria-hidden>
    <div className="size-10 shrink-0 animate-pulse rounded-full bg-surface" />
    <div className="flex w-full flex-col gap-2.5 pt-1">
      <div className="flex gap-2">
        <span className="h-3.5 w-24 animate-pulse rounded-full bg-surface" />
        <span className="h-3.5 w-16 animate-pulse rounded-full bg-surface" />
      </div>
      <span className="h-6 w-1/2 animate-pulse rounded-full bg-surface" />
    </div>
  </div>
);

export const PostListSkeleton = ({ items = 10 }: { items?: number }) => (
  <div
    className="flex w-full flex-col"
    role="status"
    aria-label="Loading posts"
  >
    {Array.from({ length: items }, (_, i) => (
      <PostSkeleton key={i} />
    ))}
  </div>
);

import { PostListSkeleton } from "~/components/posts";

export default function ProfileLoading() {
  return (
    <div aria-busy className="flex flex-col">
      <div className="flex h-13.25 items-center px-4">
        <span className="h-5 w-40 animate-pulse rounded-full bg-surface" />
      </div>
      <div className="aspect-3/1 w-full bg-banner" />
      <div className="px-4 pt-3 pb-4">
        <div className="mt-[-15%] aspect-square w-1/4 max-w-33.5 min-w-12 rounded-full border-4 border-black bg-surface" />
        <div className="mt-4 flex flex-col gap-2">
          <span className="h-5 w-40 animate-pulse rounded-full bg-surface" />
          <span className="h-4 w-24 animate-pulse rounded-full bg-surface" />
        </div>
      </div>
      <div className="h-13.25 border-b border-line" />
      <PostListSkeleton items={5} />
    </div>
  );
}

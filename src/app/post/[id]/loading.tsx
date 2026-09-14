import { NavigationHeader } from "~/components/header";

export default function PostLoading() {
  return (
    <div aria-busy className="flex flex-col">
      <NavigationHeader title="Post" />
      <div className="border-b border-line px-4 pt-3 pb-4">
        <div className="flex items-center gap-3">
          <div className="size-10 animate-pulse rounded-full bg-surface" />
          <div className="flex flex-col gap-1.5">
            <span className="h-3.5 w-28 animate-pulse rounded-full bg-surface" />
            <span className="h-3 w-20 animate-pulse rounded-full bg-surface" />
          </div>
        </div>
        <div className="mt-4 h-12 w-2/3 animate-pulse rounded-2xl bg-surface" />
        <div className="mt-4 h-4 w-40 animate-pulse rounded-full bg-surface" />
      </div>
    </div>
  );
}

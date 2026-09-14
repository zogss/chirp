import { Show } from "@clerk/nextjs";
import { Suspense } from "react";

import { EmptyState } from "~/components/emptyState";
import { NavigationHeader } from "~/components/header";
import { PostListSkeleton } from "~/components/posts";
import {
  feedInput,
  feedQueryOptions,
  PostCreate,
  PostList,
} from "~/modules/posts";
import { getQueryClient, HydrateClient, trpc } from "~/trpc/server";

export default function HomePage() {
  // start fetching on the server, the results stream to the client as soon as they're ready
  void getQueryClient().infiniteQuery(
    trpc.posts.infinite.infiniteQueryOptions(feedInput(), feedQueryOptions),
  );

  return (
    <HydrateClient>
      <NavigationHeader title="Home" showBackButton={false} />
      <Show when="signed-in">
        <div className="border-b border-line px-4 pb-3">
          <PostCreate />
        </div>
      </Show>
      <Suspense fallback={<PostListSkeleton />}>
        <PostList
          emptyState={
            <EmptyState
              title="Welcome to Chirp! 🐦"
              description="Nothing here yet. Be the first to share what's happening, in emojis only."
            />
          }
        />
      </Suspense>
    </HydrateClient>
  );
}

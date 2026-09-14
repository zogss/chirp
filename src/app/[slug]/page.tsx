import { TRPCError } from "@trpc/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";

import { EmptyState } from "~/components/emptyState";
import { PostListSkeleton } from "~/components/posts";
import { feedInput, feedQueryOptions, PostList } from "~/modules/posts";
import { ProfileHeader } from "~/modules/profile";
import { caller, getQueryClient, HydrateClient, trpc } from "~/trpc/server";

// Clerk usernames only have letters, numbers, "-" and "_". Anything else (e.g. "robots.txt")
// can't be a profile, so there's no need to ask Clerk about it.
const USERNAME_PATTERN = /^[\w-]{1,64}$/;

// ("/@Username" links are redirected to "/username" by `src/proxy.ts`)
const getProfile = cache(async (username: string) => {
  if (!USERNAME_PATTERN.test(username)) return null;

  try {
    const profile = await caller.profile.getUserByUsername({ username });
    // seed the cache, so the client components don't fetch the profile again
    getQueryClient().setQueryData(
      trpc.profile.getUserByUsername.queryKey({ username }),
      profile,
    );
    return profile;
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") return null;
    throw error;
  }
});

export async function generateMetadata({
  params,
}: PageProps<"/[slug]">): Promise<Metadata> {
  const profile = await getProfile((await params).slug);

  if (!profile) notFound();

  return {
    title: `${profile.displayName} (@${profile.username})`,
    description: `Chirps from ${profile.displayName} (@${profile.username})`,
    openGraph: { images: [profile.imageUrl] },
  };
}

export default async function ProfilePage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const profile = await getProfile(slug);

  if (!profile) notFound();

  void getQueryClient().prefetchInfiniteQuery(
    trpc.posts.infinite.infiniteQueryOptions(
      feedInput(profile.id),
      feedQueryOptions,
    ),
  );

  return (
    <HydrateClient>
      <ProfileHeader username={profile.username} />
      <Suspense fallback={<PostListSkeleton items={5} />}>
        <PostList
          authorId={profile.id}
          emptyState={
            <EmptyState
              title={`@${profile.username} hasn't chirped`}
              description="When they do, their chirps will show up here."
            />
          }
        />
      </Suspense>
    </HydrateClient>
  );
}

import { TRPCError } from "@trpc/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { NavigationHeader } from "~/components/header";
import { PostDetail } from "~/components/posts";
import { caller, getQueryClient, HydrateClient, trpc } from "~/trpc/server";

const getPost = cache(async (id: string) => {
  try {
    const post = await caller.posts.getById({ id });
    // seed the cache, so the client components don't fetch the post again
    getQueryClient().setQueryData(trpc.posts.getById.queryKey({ id }), post);
    return post;
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") return null;
    throw error;
  }
});

export async function generateMetadata({
  params,
}: PageProps<"/post/[id]">): Promise<Metadata> {
  const data = await getPost((await params).id);

  if (!data) notFound();

  const { post, author } = data;

  return {
    title: `${author.displayName} on Chirp: "${post.content}"`,
    description: post.content,
    openGraph: { images: [author.imageUrl] },
  };
}

export default async function PostPage({ params }: PageProps<"/post/[id]">) {
  const { id } = await params;

  if (!(await getPost(id))) notFound();

  return (
    <HydrateClient>
      <NavigationHeader title="Post" />
      <PostDetail id={id} />
    </HydrateClient>
  );
}

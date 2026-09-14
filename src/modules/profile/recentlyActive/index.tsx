"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";

import { Avatar } from "~/components/avatar";
import { useTRPC } from "~/trpc/react";
import { RECENTLY_ACTIVE_INPUT } from "../constants";

/**
 * "Who to follow"-style card with the people who chirped most recently.
 *
 * Its data is prefetched by the root layout and streamed in, so it must be rendered inside
 * `<Suspense>`: the server and the client then render it with the same data.
 */
export const RecentlyActive = () => {
  //* hooks
  const trpc = useTRPC();
  const { data: authors } = useSuspenseQuery(
    trpc.profile.getRecentlyActive.queryOptions(RECENTLY_ACTIVE_INPUT),
  );

  //* render
  if (authors.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-2xl border border-line">
      <h2 className="px-4 py-3 text-xl leading-6 font-extrabold">
        Recently chirping
      </h2>
      <ul>
        {authors.map((author) => (
          <li key={author.id}>
            <Link
              href={`/${author.username}`}
              className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/3"
            >
              <Avatar
                src={author.imageUrl}
                username={author.username}
                size={40}
              />
              <div className="min-w-0 leading-5">
                <p className="truncate font-bold">{author.displayName}</p>
                <p className="truncate text-muted">@{author.username}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

import Link from "next/link";

import { EmptyState } from "~/components/emptyState";
import { NavigationHeader } from "~/components/header";

export default function PostNotFound() {
  return (
    <>
      <NavigationHeader title="Post" />
      <EmptyState
        title="Hmm...this chirp doesn't exist"
        description="It may have been deleted by its author."
      >
        <Link
          href="/"
          className="inline-flex h-9 items-center rounded-full bg-brand px-4 font-bold text-white transition-colors hover:bg-brand-hover"
        >
          Back to Home
        </Link>
      </EmptyState>
    </>
  );
}

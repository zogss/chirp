import Link from "next/link";

import { EmptyState } from "~/components/emptyState";
import { NavigationHeader } from "~/components/header";

export default function NotFound() {
  return (
    <>
      <NavigationHeader title="Page not found" />
      <EmptyState
        title="Hmm...this page doesn't exist"
        description="The link may be broken, or the page may have been removed."
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

"use client";

import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { RiRefreshLine } from "react-icons/ri";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  //* hooks
  const { reset: resetQueries } = useQueryErrorResetBoundary();

  //* render
  return (
    <div className="flex flex-col items-center gap-5 px-8 py-16 text-center">
      <p className="text-muted">Something went wrong. Try reloading.</p>
      <button
        type="button"
        onClick={() => {
          // failed queries must be reset too, or they throw again right away
          resetQueries();
          reset();
        }}
        className="flex h-9 items-center gap-2 rounded-full bg-brand px-4 font-bold text-white transition-colors hover:bg-brand-hover"
      >
        <RiRefreshLine size={18} />
        Retry
      </button>
    </div>
  );
}

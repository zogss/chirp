import React from "react";

export const SimpleSpinner = () => (
  <svg
    className="h-5 w-5 animate-spin"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      stroke-width="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export const LoadingSpinner = () => (
  <span className="loader relative block h-[1em] w-[1em] overflow-hidden rounded-[50%] indent-[-9999em] text-[45px] text-slate-300" />
);

export const LoadingPage = () => (
  <div className="absolute inset-0 flex h-screen w-screen items-center justify-center">
    <LoadingSpinner />
  </div>
);

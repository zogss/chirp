import React from "react";

export const LoadingSpinner = () => (
  <span className="loader relative block h-[1em] w-[1em] overflow-hidden rounded-[50%] indent-[-9999em] text-[45px] text-[#b8b8b8]" />
);

export const LoadingPage = () => (
  <div className="absolute inset-0 flex h-screen w-screen items-center justify-center">
    <LoadingSpinner />
  </div>
);

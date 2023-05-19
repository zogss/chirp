import React, { type PropsWithChildren } from "react";

export const PageLayout = ({ children }: PropsWithChildren) => (
  <main className="flex min-h-screen justify-center">
    <div className="flex grow flex-col border-x border-slate-400 md:max-w-2xl">
      {children}
    </div>
  </main>
);

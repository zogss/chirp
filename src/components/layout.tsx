import { SignIn, useUser } from "@clerk/nextjs";
import React, { type PropsWithChildren } from "react";
import { MainHeader } from "./header";

export const PageLayout = ({ children }: PropsWithChildren) => {
  //* hooks
  const { isSignedIn } = useUser();

  //* render
  return (
    <main className="flex min-h-screen justify-center">
      <MainHeader />
      <div className="flex grow flex-col border-x border-slate-700 md:max-w-2xl">
        {children}
      </div>
      <div className="flex grow">{!isSignedIn && <SignIn />}</div>
    </main>
  );
};

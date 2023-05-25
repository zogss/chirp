import { useUser } from "@clerk/nextjs";
import React, { type PropsWithChildren } from "react";
import { useLayout } from "~/hooks/useLayout";
import { MainHeader, NavigationHeader } from "./header";
import { SideBar } from "./sideBar";
import { clsx } from "clsx";
import MobileFooter from "./mobileFooter";

export const PageLayout = ({ children }: PropsWithChildren) => {
  //* hooks
  const {
    columnsWidth: { leftWidth, mainWidth, rightWidth },
  } = useLayout();
  const { isSignedIn } = useUser();

  //* render
  return (
    <main className="flex min-h-screen flex-col-reverse justify-center sm:flex-row">
      <div
        className={clsx(
          "sticky bottom-0 z-10 flex-col items-end bg-black sm:bottom-auto sm:top-0 sm:h-screen sm:grow sm:bg-transparent",
          !isSignedIn ? "hidden sm:flex" : "flex"
        )}
        style={{
          width: leftWidth,
        }}
      >
        <MainHeader />
      </div>

      <div
        className="flex grow flex-col border-x border-slate-700 md:max-w-2xl"
        style={{
          width: mainWidth,
        }}
      >
        <NavigationHeader />
        {children}
      </div>

      <div
        className="sticky top-0 hidden h-screen grow flex-col items-start sm:flex"
        style={{
          width: rightWidth,
        }}
      >
        <SideBar />
      </div>

      <MobileFooter />
    </main>
  );
};

import React, { type PropsWithChildren } from "react";
import { useLayout } from "~/hooks/useLayout";
import { MainHeader } from "./header";
import { SideBar } from "./sideBar";

export const PageLayout = ({ children }: PropsWithChildren) => {
  //* hooks
  const {
    columnsWidth: { leftWidth, mainWidth, rightWidth },
  } = useLayout();

  //* render
  return (
    <main className="flex min-h-screen justify-center">
      <div
        className="flex min-h-screen grow flex-col items-end"
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
        {children}
      </div>
      <div
        className="hidden min-h-screen grow flex-col items-start sm:flex"
        style={{
          width: rightWidth,
        }}
      >
        <SideBar />
      </div>
    </main>
  );
};

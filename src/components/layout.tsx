import type { PropsWithChildren } from "react";

import { BottomBar } from "./bottomBar";
import { SideBar } from "./sideBar";
import { SideNav } from "./sideNav";

/**
 * Twitter's three columns: navigation, a 600px main column and a sidebar. Columns collapse with the
 * screen size (icon-only navigation below `xl`, no sidebar below `lg`, a bottom tab bar on phones)
 * using CSS only, so there's no layout shift after hydration.
 */
export const PageLayout = ({ children }: PropsWithChildren) => (
  <div className="flex min-h-dvh justify-center">
    <SideNav />
    <main className="flex min-h-dvh w-full max-w-150 min-w-0 flex-col border-line sm:border-x">
      {children}
      <BottomBar />
    </main>
    <SideBar />
  </div>
);

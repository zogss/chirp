import { Show } from "@clerk/nextjs";
import { Suspense } from "react";

import { RecentlyActive } from "~/modules/profile";
import { AuthCard } from "./authCard";

/** Right column (desktop). */
export const SideBar = () => (
  <aside className="sticky top-0 hidden h-dvh w-72.5 shrink-0 flex-col gap-4 overflow-y-auto py-3 pl-6 lg:flex xl:w-87.5 xl:pl-8">
    <Show when="signed-out">
      <AuthCard />
    </Show>
    <Suspense>
      <RecentlyActive />
    </Suspense>
    <footer className="px-4 text-[13px] leading-4 text-muted">
      Chirp · Emojis only 🐦
    </footer>
  </aside>
);

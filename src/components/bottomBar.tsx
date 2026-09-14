import { Show, SignInButton, SignUpButton } from "@clerk/nextjs";

import { ComposeButton } from "./composeButton";
import { MobileTabBar } from "./mobileTabBar";

/**
 * Fixed bars at the bottom of the screen: the tab bar and compose button for signed-in users on
 * phones, and the sign in banner for signed-out visitors. The spacers keep them from covering the
 * end of the page.
 */
export const BottomBar = () => (
  <>
    <Show when="signed-in">
      <div aria-hidden className="h-13.25 shrink-0 sm:hidden" />
      <MobileTabBar />
      <ComposeButton variant="floating" />
    </Show>
    <Show when="signed-out">
      <div aria-hidden className="h-15 shrink-0 sm:h-19" />
      <div className="fixed inset-x-0 bottom-0 z-30 bg-brand pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto flex max-w-247.5 items-center justify-between gap-4 px-4 py-3">
          <div className="hidden leading-tight sm:block">
            <p className="text-[23px] font-bold">
              Don&apos;t miss what&apos;s happening
            </p>
            <p>People on Chirp are the first to know.</p>
          </div>
          <div className="flex w-full gap-3 sm:w-auto">
            <SignInButton mode="modal">
              <button
                type="button"
                className="h-9 flex-1 rounded-full border border-white/35 px-4 font-bold text-white transition-colors hover:bg-white/10 sm:flex-none"
              >
                Log in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button
                type="button"
                className="h-9 flex-1 rounded-full bg-white px-4 font-bold text-black transition-colors hover:bg-white/90 sm:flex-none"
              >
                Sign up
              </button>
            </SignUpButton>
          </div>
        </div>
      </div>
    </Show>
  </>
);

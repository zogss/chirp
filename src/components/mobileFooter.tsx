import React from "react";
import { SignedOut, SignInButton } from "@clerk/nextjs";

const MobileFooter = () => (
  <SignedOut>
    <div className="fixed bottom-0 z-20 flex w-full items-center justify-center bg-black px-3 py-5 shadow-outline-white lg:hidden">
      <SignInButton mode="modal">
        <button
          type="button"
          title="Click to sign in or sign up"
          className="flex w-fit justify-center rounded-full bg-black px-6 py-1.5 text-sm font-semibold text-white shadow-outline-white transition-all hover:bg-white hover:bg-opacity-10 md:w-1/3"
        >
          Sign in or sign up
        </button>
      </SignInButton>
    </div>
  </SignedOut>
);

export default MobileFooter;

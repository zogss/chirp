import React, { useState } from "react";
import { SignInButton, SignedOut } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";

export const LoginButton = () => {
  //* states
  const [isHovered, setIsHovered] = useState(false);

  //* render
  return (
    <SignedOut>
      <SignInButton mode="modal">
        <motion.button
          type="button"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex h-fit w-full min-w-[9.375rem] items-center justify-start gap-8 rounded-sm border-2 border-slate-700 bg-transparent py-2 pl-6 pr-2 text-base text-white transition-all hover:bg-slate-700"
        >
          Sign in
          <AnimatePresence mode="wait">
            {isHovered && (
              <motion.svg
                initial={{ x: -20, scale: 0.4 }}
                animate={{ x: 0, scale: 1 }}
                exit={{ x: -20, scale: 0.4 }}
                transition={{ duration: 0.1, ease: "easeInOut" }}
                width={24}
                height={24}
                viewBox="0 0 20 20"
                stroke="currentColor"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="cl-socialButtonsBlockButtonArrow cl-socialButtonsBlockButtonArrow__github 🔒️ cl-internal-u0g48b"
              >
                <path
                  d="M3.333 10h13.332m-4.999-5 5 5-5 5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.button>
      </SignInButton>
    </SignedOut>
  );
};

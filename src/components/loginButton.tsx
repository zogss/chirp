import React, { useState } from "react";
import { SignInButton, SignedOut } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";

export const LoginButton = () => {
  //* states
  const [isHovered, setIsHovered] = useState(false);

  //* render
  return (
    <SignedOut>
      <div className="flex h-fit flex-col gap-3 rounded-2xl bg-black p-4 shadow-outline-white">
        <span className="text-sm font-bold text-gray-300 xl:text-base">
          Don&apos;t have an account?
        </span>
        <SignInButton mode="modal">
          <motion.button
            type="button"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex h-fit w-full min-w-[9.375rem] items-center justify-between gap-8 rounded-lg border border-gray-400 bg-transparent px-6 py-2 text-base text-white transition-all hover:bg-white hover:bg-opacity-10"
          >
            Sign in
            <AnimatePresence mode="wait">
              {isHovered && (
                <motion.svg
                  initial={{ x: -20, scale: 0.4 }}
                  animate={{ x: 0, scale: 1 }}
                  exit={{ x: -20, scale: 0.4 }}
                  transition={{ duration: 0.1, ease: "easeInOut" }}
                  width={16}
                  height={16}
                  viewBox="0 0 20 20"
                  stroke="currentColor"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
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
      </div>
    </SignedOut>
  );
};

"use client";

import {
  CloseButton,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { clsx } from "clsx";
import { useState } from "react";
import { RiCloseLine, RiQuillPenFill } from "react-icons/ri";

import { PostCreate } from "~/modules/posts/postCreate";

interface ComposeButtonProps {
  /** `sidebar` is the big button of the side navigation, `floating` the mobile action button. */
  variant: "sidebar" | "floating";
}

/** Opens the composer in a dialog, so posting is possible from any page. */
export const ComposeButton = ({ variant }: ComposeButtonProps) => {
  //* states
  const [isOpen, setIsOpen] = useState(false);

  //* render
  return (
    <>
      <button
        type="button"
        aria-label="Chirp"
        onClick={() => setIsOpen(true)}
        className={clsx(
          "flex items-center justify-center rounded-full bg-brand font-bold text-white transition-colors hover:bg-brand-hover",
          variant === "sidebar"
            ? "mt-4 size-13 text-[17px] xl:w-[90%]"
            : "fixed right-4 bottom-[calc(69px+env(safe-area-inset-bottom))] z-30 size-14 shadow-popover sm:hidden",
        )}
      >
        <RiQuillPenFill
          size={24}
          className={clsx(variant === "sidebar" && "xl:hidden")}
        />
        {variant === "sidebar" && (
          <span className="hidden xl:inline">Chirp</span>
        )}
      </button>

      <Dialog open={isOpen} onClose={setIsOpen} className="relative z-50">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-backdrop transition-opacity duration-200 data-closed:opacity-0"
        />
        <div className="fixed inset-0 flex items-start justify-center sm:px-4 sm:pt-[5vh]">
          <DialogPanel
            transition
            className="flex h-dvh w-full flex-col bg-black transition duration-200 ease-out data-closed:opacity-0 sm:h-auto sm:max-w-150 sm:rounded-2xl sm:data-closed:scale-95"
          >
            <DialogTitle className="sr-only">Compose a chirp</DialogTitle>
            <div className="flex h-13.25 shrink-0 items-center px-2">
              <CloseButton
                aria-label="Close"
                className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-foreground/10"
              >
                <RiCloseLine size={20} />
              </CloseButton>
            </div>
            <div className="px-4 pb-3">
              <PostCreate autoFocus onPosted={() => setIsOpen(false)} />
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

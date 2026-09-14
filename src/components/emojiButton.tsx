"use client";

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import dynamic from "next/dynamic";
import { RiEmotionLine } from "react-icons/ri";

import { Spinner } from "./loading";

const EmojiPicker = dynamic(() => import("./emojiPicker"), {
  ssr: false,
  loading: () => (
    <div className="flex h-100 w-[320px] items-center justify-center bg-black">
      <Spinner />
    </div>
  ),
});

interface EmojiButtonProps {
  onSelect: (emoji: string) => void;
}

export const EmojiButton = ({ onSelect }: EmojiButtonProps) => (
  // touch devices already have an emoji keyboard
  <Popover className="pointer-coarse:hidden">
    <PopoverButton
      aria-label="Add emoji"
      className="-ml-2 flex size-9 items-center justify-center rounded-full text-brand transition-colors outline-none hover:bg-brand/10 data-focus:bg-brand/10 data-open:bg-brand/10"
    >
      <RiEmotionLine size={20} />
    </PopoverButton>
    <PopoverPanel
      anchor={{ to: "bottom start", gap: 4 }}
      transition
      className="z-50 overflow-hidden rounded-2xl shadow-popover transition duration-150 ease-out data-closed:-translate-y-1 data-closed:opacity-0"
    >
      <EmojiPicker onSelect={onSelect} />
    </PopoverPanel>
  </Popover>
);

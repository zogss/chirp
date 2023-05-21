import { Popover, Transition } from "@headlessui/react";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import React, { Fragment, useCallback } from "react";
import { BsEmojiSmile } from "react-icons/bs";

interface EmojiButtonProps {
  value: string;
  onChange: (value: string) => void;
}

const EmojiButton = ({ value, onChange }: EmojiButtonProps) => {
  //* handlers
  const onEmojiClick = useCallback(
    (emojiData: EmojiClickData) => {
      onChange(value + emojiData.emoji);
    },
    [onChange, value]
  );

  //* render
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button className="rounded-full p-1.5 text-slate-500 transition-all hover:bg-slate-200 hover:bg-opacity-10 hover:text-slate-200 disabled:grayscale-[30%]">
            <BsEmojiSmile size={20} />
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute left-1/2 z-10 mt-3 -translate-x-6 transform px-4 sm:px-0 lg:max-w-3xl">
              <EmojiPicker
                onEmojiClick={onEmojiClick}
                autoFocusSearch={false}
              />
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default EmojiButton;

"use client";

import Picker, { EmojiStyle, Theme } from "emoji-picker-react";
import type { CSSProperties } from "react";

// Match the picker to the app's black theme
const pickerStyle = {
  "--epr-bg-color": "#000000",
  "--epr-category-label-bg-color": "rgba(0, 0, 0, 0.9)",
  "--epr-picker-border-color": "transparent",
  "--epr-highlight-color": "#1d9bf0",
  "--epr-hover-bg-color": "rgba(29, 155, 240, 0.1)",
  "--epr-focus-bg-color": "rgba(29, 155, 240, 0.2)",
  "--epr-search-input-bg-color": "#202327",
  "--epr-search-border-color": "#1d9bf0",
  "--epr-text-color": "#e7e9ea",
} as CSSProperties;

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

/** Loaded on demand by `EmojiButton`, the picker is a heavy dependency. */
export default function EmojiPicker({ onSelect }: EmojiPickerProps) {
  return (
    <Picker
      theme={Theme.DARK}
      emojiStyle={EmojiStyle.NATIVE}
      autoFocusSearch={false}
      lazyLoadEmojis
      previewConfig={{ showPreview: false }}
      width={320}
      height={400}
      style={pickerStyle}
      onEmojiClick={({ emoji }) => onSelect(emoji)}
    />
  );
}

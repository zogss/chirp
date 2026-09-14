import emojiRegex from "emoji-regex";
import { z } from "zod";

export const POST_MAX_LENGTH = 280;

/** Whether `text` has at least one emoji and nothing but emojis and whitespace. */
export const isEmojiOnly = (text: string) => {
  const withoutEmojis = text.replace(emojiRegex(), "");

  return withoutEmojis.length !== text.length && withoutEmojis.trim() === "";
};

/**
 * Twitter-style weighted length: every emoji counts as 2 characters and anything else as 1, no
 * matter how many code points the emoji is made of (👨‍👩‍👧‍👦 alone is 11 UTF-16 code units).
 */
export const getPostLength = (text: string) => {
  const emojiCount = text.match(emojiRegex())?.length ?? 0;

  return emojiCount * 2 + text.replace(emojiRegex(), "").length;
};

/** Shared by the API input validation and the composer, so both agree on what's valid. */
export const postContentSchema = z
  .string()
  // cheap guard against huge payloads, before running the emoji regex on them
  .max(POST_MAX_LENGTH * 10, { abort: true, message: "Your chirp is too long" })
  .trim()
  .min(1, "Your chirp can't be empty")
  .refine(isEmojiOnly, "Only emojis are allowed!")
  .refine(
    (text) => getPostLength(text) <= POST_MAX_LENGTH,
    `Chirps can't be longer than ${POST_MAX_LENGTH} characters (emojis count as 2)`,
  );

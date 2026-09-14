"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clsx } from "clsx";
import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import toast from "react-hot-toast";

import { Avatar } from "~/components/avatar";
import { EmojiButton } from "~/components/emojiButton";
import { Spinner } from "~/components/loading";
import { useTRPC } from "~/trpc/react";
import {
  getPostLength,
  isEmojiOnly,
  POST_MAX_LENGTH,
  postContentSchema,
} from "~/utils/emoji";
import { feedInput } from "../constants";

// errors whose message is meant to be shown to the user
const USER_FACING_ERRORS = new Set([
  "TOO_MANY_REQUESTS",
  "PRECONDITION_FAILED",
  "UNAUTHORIZED",
]);

/** Twitter's circular character counter, showing the remaining characters close to the limit. */
const CharacterCounter = ({ length }: { length: number }) => {
  const remaining = POST_MAX_LENGTH - length;
  const isNearLimit = remaining <= 20;
  const radius = isNearLimit ? 13 : 9;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(length / POST_MAX_LENGTH, 1);

  return (
    <div
      role="progressbar"
      aria-label="Characters used"
      aria-valuemin={0}
      aria-valuemax={POST_MAX_LENGTH}
      aria-valuenow={length}
      className="relative flex size-7.5 items-center justify-center"
    >
      <svg
        viewBox="0 0 30 30"
        className="absolute inset-0 size-full -rotate-90"
      >
        <circle
          cx="15"
          cy="15"
          r={radius}
          fill="none"
          strokeWidth="2"
          className="stroke-line transition-all"
        />
        <circle
          cx="15"
          cy="15"
          r={radius}
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          className={clsx(
            "transition-all",
            remaining < 0
              ? "stroke-danger"
              : isNearLimit
                ? "stroke-warning"
                : "stroke-brand",
          )}
        />
      </svg>
      {isNearLimit && (
        <span
          className={clsx(
            "relative text-[13px]",
            remaining < 0 ? "text-danger" : "text-muted",
          )}
        >
          {remaining}
        </span>
      )}
    </div>
  );
};

interface PostCreateProps {
  autoFocus?: boolean;
  /** Called once the post is created, e.g. to close the compose dialog. */
  onPosted?: () => void;
}

export const PostCreate = ({
  autoFocus = false,
  onPosted,
}: PostCreateProps) => {
  //* hooks
  const { user } = useUser();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  //* states
  const [content, setContent] = useState("");

  const { mutate, isPending } = useMutation(
    trpc.posts.create.mutationOptions({
      onSuccess: (newPost) => {
        setContent("");

        // show the new post at the top of the loaded feeds right away
        for (const input of [feedInput(), feedInput(newPost.author.id)]) {
          queryClient.setQueryData(
            trpc.posts.infinite.infiniteQueryKey(input),
            (feed) =>
              feed && {
                ...feed,
                pages: feed.pages.map((page, index) =>
                  index === 0
                    ? { ...page, posts: [newPost, ...page.posts] }
                    : page,
                ),
              },
          );
        }
        // post counts and "recently chirping" changed too
        void queryClient.invalidateQueries(trpc.profile.pathFilter());

        toast.success("Your chirp was sent");
        onPosted?.();
      },
      onError: (error) => {
        const message =
          error.data?.zodError?.fieldErrors.content?.[0] ??
          (error.data && USER_FACING_ERRORS.has(error.data.code)
            ? error.message
            : null);

        toast.error(message ?? "Failed to chirp! Please try again later.");
      },
    }),
  );

  //* handlers
  const postLength = getPostLength(content.trim());
  const parsedContent = postContentSchema.safeParse(content);
  const hasNonEmojis = postLength > 0 && !isEmojiOnly(content);

  const submit = () => {
    if (parsedContent.success && !isPending) {
      mutate({ content: parsedContent.data });
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sends the chirp, Shift+Enter adds a new line
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      submit();
    }
  };

  const insertEmoji = (emoji: string) => {
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart ?? content.length;
    const end = textarea?.selectionEnd ?? content.length;

    setContent(content.slice(0, start) + emoji + content.slice(end));
    // keep the caret right after the inserted emoji
    requestAnimationFrame(() =>
      textarea?.setSelectionRange(start + emoji.length, start + emoji.length),
    );
  };

  //* render
  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <div className="pt-3">
        {user ? (
          <Avatar
            src={user.imageUrl}
            username={user.username ?? ""}
            size={40}
          />
        ) : (
          <div className="size-10 animate-pulse rounded-full bg-surface" />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <textarea
          ref={textareaRef}
          aria-label="Chirp text"
          placeholder="What's happening?! Emojis only 🐦"
          autoFocus={autoFocus}
          data-autofocus={autoFocus || undefined}
          rows={1}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          onKeyDown={handleKeyDown}
          className="field-sizing-content max-h-[50vh] min-h-13 w-full resize-none bg-transparent py-3 text-xl leading-7 outline-none placeholder:text-muted"
        />
        {hasNonEmojis && (
          <p role="alert" className="pb-3 text-[13px] text-danger">
            Only emojis are allowed!
          </p>
        )}
        <div className="flex items-center gap-3 border-t border-line pt-3">
          <EmojiButton onSelect={insertEmoji} />
          <div className="ml-auto flex items-center gap-3">
            {postLength > 0 && <CharacterCounter length={postLength} />}
            <button
              type="submit"
              disabled={!parsedContent.success || isPending}
              className="flex h-9 items-center gap-2 rounded-full bg-brand px-4 font-bold text-white transition-colors hover:bg-brand-hover disabled:pointer-events-none disabled:opacity-50"
            >
              {isPending && <Spinner size={16} tone="current" />}
              Chirp
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

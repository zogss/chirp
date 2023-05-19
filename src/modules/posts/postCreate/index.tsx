import { useUser } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React, { useState } from "react";
import { SimpleSpinner } from "~/components/loading";
import { api } from "~/utils/api";
import toast from "react-hot-toast";

export const PostCreate = () => {
  //* hooks
  const { user } = useUser();
  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setContent("");
      void ctx.posts.getAll.invalidate();
    },
    onError: ({ data }) => {
      const errorMessage = data?.zodError?.fieldErrors?.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to create post! Please try again later.");
      }
    },
  });

  //* states
  const [content, setContent] = useState("");

  //* render
  if (!user) return null;

  return (
    <div className="flex w-full gap-3">
      <Image
        src={user.profileImageUrl}
        alt="Profile image"
        className="h-14 w-14 flex-shrink-0 rounded-full"
        width={56}
        height={56}
        placeholder="blur"
        blurDataURL="https://img.freepik.com/free-vector/white-blurred-background_1034-249.jpg"
      />
      <div className="flex w-full flex-col gap-2">
        <input
          type="text"
          placeholder="Type some emojis!"
          className="grow bg-transparent outline-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            e.preventDefault();
            if (e.key === "Enter") {
              mutate({
                content,
              });
            }
          }}
        />
        <motion.button
          type="button"
          title="Tweet"
          disabled={!content || isPosting}
          onClick={() =>
            mutate({
              content,
            })
          }
          className="flex w-fit items-center justify-center gap-2 self-end rounded-full bg-blue-600 px-4 py-2 font-bold text-slate-100 transition-all disabled:grayscale-[30%]"
        >
          Tweet
          <AnimatePresence mode="wait">
            {isPosting && (
              <motion.span
                key="spinner"
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SimpleSpinner />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
};

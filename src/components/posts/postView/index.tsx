import { motion, usePresence } from "framer-motion";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import type { RouterOutputs } from "~/utils/api";
import { clsx } from "clsx";

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

export const PostView = ({ post, author }: PostWithUser) => {
  //* hooks
  const router = useRouter();
  const [isPresent, safeToRemove] = usePresence();

  //* effects
  useEffect(() => {
    !isPresent && setTimeout(safeToRemove, 1000);
  }, [isPresent, safeToRemove]);

  //* render
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", duration: 1 }}
      onClick={() => void router.push(`/post/${post.id}`)}
      className="flex cursor-pointer gap-3 border-b border-slate-700 p-4 transition-all duration-500 hover:bg-white hover:bg-opacity-5"
    >
      <Image
        src={author?.profileImageUrl}
        alt={`${author.username || "user"} - profile image`}
        width={48}
        height={48}
        className="h-12 w-12 shrink-0 rounded-full"
      />
      <div
        className={clsx("flex flex-col gap-2 transition-all", {
          "scale-95": isPresent,
          "scale-100": !isPresent,
        })}
      >
        <div className="flex gap-2">
          <Link
            href={`/${author.username}`}
            onClick={(e) => e.stopPropagation()}
            className=""
          >
            <span className="block max-w-[30vw] truncate font-bold text-white transition-all hover:underline sm:max-w-[35vw] lg:max-w-full">{`${
              author.firstName || ""
            } ${author.lastName || ""}`}</span>
          </Link>
          <div className="flex items-center text-slate-500">
            <Link
              href={`/${author.username}`}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="block max-w-[25vw] truncate sm:max-w-[18vw] lg:max-w-full">{`@${author.username}`}</span>
            </Link>
            <span className="px-1">•</span>
            <Link
              href={`/post/${post.id}`}
              onClick={(e) => e.stopPropagation()}
              className="shrink-0 transition-all hover:underline"
            >
              <span className="truncate">
                {moment(post.createdAt).startOf("milliseconds").fromNow(true)}
              </span>
            </Link>
          </div>
        </div>
        <p className="">{post.content}</p>
      </div>
    </motion.div>
  );
};

import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import type { RouterOutputs } from "~/utils/api";

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

export const PostView = ({ post, author }: PostWithUser) => {
  return (
    <div className="flex gap-3 border-b border-slate-700 p-4">
      <Image
        src={author?.profileImageUrl}
        alt={`${author.username || "user"} - profile image`}
        className="rounded-full"
        width={48}
        height={48}
        placeholder="blur"
        blurDataURL="https://img.freepik.com/free-vector/white-blurred-background_1034-249.jpg"
      />
      <div className="flex flex-col ">
        <div className="flex gap-2">
          <span className="font-semibold text-slate-300">{`${
            author.firstName || ""
          } ${author.lastName || ""}`}</span>
          <div className="text-slate-500">
            <Link href={`/@${author.username}`}>
              <span>{`@${author.username}`}</span>
            </Link>
            <span className="px-1">•</span>
            <Link href={`/post/${post.id}`}>
              <span>
                {moment(post.createdAt).startOf("milliseconds").fromNow()}
              </span>
            </Link>
          </div>
        </div>
        <p className="">{post.content}</p>
      </div>
    </div>
  );
};

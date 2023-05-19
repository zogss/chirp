import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";

export const PostCreate = () => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="flex w-full gap-3">
      <Image
        src={user.profileImageUrl}
        alt="Profile image"
        className="rounded-full"
        width={56}
        height={56}
        placeholder="blur"
        blurDataURL="https://img.freepik.com/free-vector/white-blurred-background_1034-249.jpg"
      />
      <input
        type="text"
        placeholder="Type some emojis!"
        className="grow bg-transparent outline-none"
      />
    </div>
  );
};

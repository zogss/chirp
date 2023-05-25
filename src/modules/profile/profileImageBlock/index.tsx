import type { User } from "@clerk/nextjs/server";
import React from "react";
import Image from "next/image";

export const ProfileImageBlock = ({
  profileImageUrl,
  username,
}: Partial<User>) => (
  <div>
    <div className="relative h-40 bg-slate-600">
      <Image
        src={profileImageUrl || ""}
        alt={`${username || ""} - profile image`}
        width={128}
        height={128}
        className="absolute bottom-0 left-0 -mb-16 ml-4 h-32 w-32 rounded-full border-4 border-black"
      />
    </div>
    <div className="h-16" />
  </div>
);

import Image from "next/image";

import type { RouterOutputs } from "~/trpc/react";
import { ProfileManagementButton } from "../profileManagementButton";

type Profile = RouterOutputs["profile"]["getUserByUsername"];

export const ProfileImageBlock = ({
  id,
  username,
  imageUrl,
}: Pick<Profile, "id" | "username" | "imageUrl">) => (
  <div>
    <div className="aspect-3/1 w-full bg-banner" />
    <div className="flex items-start justify-between px-4 pt-3">
      <div className="mt-[-15%] w-1/4 max-w-33.5 min-w-12 rounded-full border-4 border-black bg-black">
        <Image
          src={imageUrl}
          alt={`@${username}'s profile picture`}
          width={134}
          height={134}
          // it's usually the largest image above the fold
          loading="eager"
          className="aspect-square h-auto w-full rounded-full object-cover"
        />
      </div>
      <ProfileManagementButton userId={id} />
    </div>
  </div>
);

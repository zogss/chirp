import { RiCalendarLine } from "react-icons/ri";

import { Timestamp } from "~/components/timestamp";
import type { RouterOutputs } from "~/trpc/react";

type Profile = RouterOutputs["profile"]["getUserByUsername"];

export const ProfileData = ({
  displayName,
  username,
  createdAt,
}: Pick<Profile, "displayName" | "username" | "createdAt">) => (
  <div className="flex flex-col gap-3 px-4 pt-1 pb-4">
    <div>
      <h2 className="text-xl leading-6 font-extrabold wrap-break-word">
        {displayName}
      </h2>
      <p className="text-muted">@{username}</p>
    </div>
    <p className="flex items-center gap-1 text-muted">
      <RiCalendarLine size={18} aria-hidden />
      <Timestamp date={new Date(createdAt)} variant="joined" />
    </p>
  </div>
);

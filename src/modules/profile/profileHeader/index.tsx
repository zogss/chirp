"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { NavigationHeader } from "~/components/header";
import { useTRPC } from "~/trpc/react";
import { ProfileData } from "../profileData";
import { ProfileImageBlock } from "../profileImageBlock";

interface ProfileHeaderProps {
  username: string;
}

export const ProfileHeader = ({ username }: ProfileHeaderProps) => {
  //* hooks
  const trpc = useTRPC();
  const { data: profile } = useSuspenseQuery(
    trpc.profile.getUserByUsername.queryOptions({ username }),
  );

  //* render
  return (
    <>
      <NavigationHeader
        title={profile.displayName}
        subtitle={`${profile.postCount} ${profile.postCount === 1 ? "chirp" : "chirps"}`}
      />
      <ProfileImageBlock {...profile} />
      <ProfileData {...profile} />
      <nav aria-label="Profile" className="flex border-b border-line">
        <span
          aria-current="page"
          className="relative flex h-13.25 flex-1 items-center justify-center font-bold sm:flex-none sm:px-8"
        >
          Chirps
          <span className="absolute bottom-0 h-1 w-14 rounded-full bg-brand" />
        </span>
      </nav>
    </>
  );
};

"use client";

import { useAuth, useClerk } from "@clerk/nextjs";

interface ProfileManagementButtonProps {
  userId: string;
}

/** "Edit profile" on the signed-in user's own profile, opening Clerk's account modal. */
export const ProfileManagementButton = ({
  userId,
}: ProfileManagementButtonProps) => {
  //* hooks
  const { userId: viewerId } = useAuth();
  const { openUserProfile } = useClerk();

  //* render
  if (viewerId !== userId) return null;

  return (
    <button
      type="button"
      onClick={() => openUserProfile()}
      className="h-9 shrink-0 rounded-full border border-line-strong px-4 font-bold transition-colors hover:bg-foreground/10"
    >
      Edit profile
    </button>
  );
};

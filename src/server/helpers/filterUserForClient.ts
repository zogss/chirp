import type { User } from "@clerk/nextjs/server";

export const filterUserForClient = (user: User) => ({
  id: user.id,
  username: user.username,
  displayName:
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.username ||
    "Chirper",
  imageUrl: user.imageUrl,
  createdAt: user.createdAt,
});

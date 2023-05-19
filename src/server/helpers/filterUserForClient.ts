import type { User } from "@clerk/nextjs/server";

export const filterUserForClient = (user: User) => ({
  id: user.id,
  username: user.username,
  firstName: user.firstName,
  lastName: user.lastName,
  profileImageUrl: user.profileImageUrl,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

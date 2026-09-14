"use client";

import { useAuth, useClerk, useUser } from "@clerk/nextjs";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { RiMoreFill } from "react-icons/ri";

import { Avatar } from "./avatar";

const menuItemClassName =
  "w-full px-4 py-3 text-left font-bold transition-colors data-focus:bg-white/3";

const AccountButtonSkeleton = () => (
  <div aria-hidden className="my-3 flex items-center gap-3 p-3">
    <div className="size-10 shrink-0 animate-pulse rounded-full bg-surface" />
    <div className="hidden flex-col gap-1.5 xl:flex">
      <span className="h-3.5 w-24 animate-pulse rounded-full bg-surface" />
      <span className="h-3 w-16 animate-pulse rounded-full bg-surface" />
    </div>
  </div>
);

export const AccountMenu = () => {
  //* hooks
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  //* render
  if (!isSignedIn) return null;

  if (!user) return <AccountButtonSkeleton />;

  const username = user.username ?? "";

  return (
    <Menu>
      <MenuButton className="my-3 flex w-full items-center gap-3 rounded-full p-3 text-left transition-colors outline-none hover:bg-foreground/10 data-focus:bg-foreground/10 data-open:bg-foreground/10">
        <Avatar src={user.imageUrl} username={username} size={40} />
        <div className="hidden min-w-0 flex-1 leading-5 xl:block">
          <p className="truncate font-bold">{user.fullName ?? username}</p>
          <p className="truncate text-muted">@{username}</p>
        </div>
        <RiMoreFill size={18} className="hidden xl:block" />
      </MenuButton>
      <MenuItems
        anchor={{ to: "top start", gap: 8 }}
        transition
        className="z-40 w-75 rounded-2xl bg-black py-3 shadow-popover transition duration-100 ease-out outline-none data-closed:scale-95 data-closed:opacity-0"
      >
        <MenuItem>
          <button
            type="button"
            onClick={() => openUserProfile()}
            className={menuItemClassName}
          >
            Manage account
          </button>
        </MenuItem>
        <MenuItem>
          <button
            type="button"
            onClick={() => void signOut({ redirectUrl: "/" })}
            className={menuItemClassName}
          >
            Log out @{username}
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
};

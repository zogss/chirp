"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  RiHome7Fill,
  RiHome7Line,
  RiUser3Fill,
  RiUser3Line,
} from "react-icons/ri";

const tabClassName = "flex h-13.25 flex-1 items-center justify-center";

/** Bottom navigation for signed-in users on phones. */
export const MobileTabBar = () => {
  //* hooks
  const pathname = usePathname();
  const { user } = useUser();

  //* render
  const profileHref = user?.username ? `/${user.username}` : null;

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-black/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-md sm:hidden"
    >
      <Link
        href="/"
        aria-label="Home"
        aria-current={pathname === "/" ? "page" : undefined}
        className={tabClassName}
      >
        {pathname === "/" ? (
          <RiHome7Fill size={26} />
        ) : (
          <RiHome7Line size={26} />
        )}
      </Link>
      {profileHref ? (
        <Link
          href={profileHref}
          aria-label="Profile"
          aria-current={pathname === profileHref ? "page" : undefined}
          className={tabClassName}
        >
          {pathname === profileHref ? (
            <RiUser3Fill size={26} />
          ) : (
            <RiUser3Line size={26} />
          )}
        </Link>
      ) : (
        <span aria-hidden className={`${tabClassName} text-muted`}>
          <RiUser3Line size={26} />
        </span>
      )}
    </nav>
  );
};

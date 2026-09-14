"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { clsx } from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { IconType } from "react-icons";
import { PiBirdFill } from "react-icons/pi";
import {
  RiHome7Fill,
  RiHome7Line,
  RiUser3Fill,
  RiUser3Line,
} from "react-icons/ri";

import { AccountMenu } from "./accountMenu";
import { ComposeButton } from "./composeButton";

interface NavItemProps {
  href: string;
  label: string;
  icon: IconType;
  activeIcon: IconType;
  isActive: boolean;
}

const NavItem = ({
  href,
  label,
  icon: Icon,
  activeIcon: ActiveIcon,
  isActive,
}: NavItemProps) => (
  <Link
    href={href}
    aria-label={label}
    aria-current={isActive ? "page" : undefined}
    className="group flex py-1 outline-none"
  >
    <span className="flex items-center gap-5 rounded-full p-3 transition-colors group-hover:bg-foreground/10 group-focus-visible:outline-2 group-focus-visible:outline-brand xl:pr-6">
      {isActive ? <ActiveIcon size={26} /> : <Icon size={26} />}
      <span
        className={clsx(
          "hidden text-xl leading-6 xl:inline",
          isActive && "font-bold",
        )}
      >
        {label}
      </span>
    </span>
  </Link>
);

/** Left column: logo, navigation, compose button and account menu (tablet and desktop). */
export const SideNav = () => {
  //* hooks
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  //* render
  const profileHref = user?.username ? `/${user.username}` : null;

  return (
    <header className="sticky top-0 hidden h-dvh w-22 shrink-0 flex-col justify-between px-2 sm:flex xl:w-68.75">
      <div className="flex flex-col items-center xl:items-start">
        <Link
          href="/"
          aria-label="Chirp"
          className="my-1 flex size-13 items-center justify-center rounded-full transition-colors hover:bg-foreground/10"
        >
          <PiBirdFill size={32} />
        </Link>
        <nav
          aria-label="Primary"
          className="flex flex-col items-center xl:items-start"
        >
          <NavItem
            href="/"
            label="Home"
            icon={RiHome7Line}
            activeIcon={RiHome7Fill}
            isActive={pathname === "/"}
          />
          {isSignedIn &&
            (profileHref ? (
              <NavItem
                href={profileHref}
                label="Profile"
                icon={RiUser3Line}
                activeIcon={RiUser3Fill}
                isActive={pathname === profileHref}
              />
            ) : (
              // keeps the layout from shifting while the user loads
              <div aria-hidden className="h-14.5" />
            ))}
        </nav>
        {isSignedIn && <ComposeButton variant="sidebar" />}
      </div>
      <AccountMenu />
    </header>
  );
};

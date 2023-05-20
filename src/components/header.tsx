import Link from "next/link";
import React from "react";
import { AccountMenu } from "./accountMenu";
import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import { BsFillPersonFill, BsPerson } from "react-icons/bs";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import clsx from "clsx";

const HeaderItems = () => {
  //* hooks
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  //* render
  if (!isSignedIn) return null;

  return (
    <div className="flex flex-col items-start justify-start gap-2">
      <Link
        href="/"
        aria-label="Go to home page"
        className={clsx(
          "flex items-center gap-4 rounded-full py-2.5 pl-4 pr-8 text-base transition-all hover:bg-slate-200 hover:bg-opacity-10",
          {
            "font-bold text-white": router.asPath === "/",
            "font-semibold text-gray-300": router.asPath !== "/",
          }
        )}
      >
        {router.asPath === "/" ? (
          <AiFillHome size={32} />
        ) : (
          <AiOutlineHome size={32} />
        )}
        Home
      </Link>
      <Link
        href={`/${(isLoaded && user.username) || ""}`}
        aria-label="Go to profile page"
        className={clsx(
          "flex items-center gap-4 rounded-full py-2.5 pl-4 pr-8 text-base transition-all hover:bg-slate-200 hover:bg-opacity-10",
          {
            "font-bold text-white":
              isLoaded &&
              user.username &&
              router.asPath === `/${user.username}`,
            "font-semibold text-gray-300":
              isLoaded &&
              user.username &&
              router.asPath !== `/${user.username}`,
          }
        )}
      >
        {isLoaded && user.username && router.asPath !== `/${user.username}` ? (
          <BsPerson size={32} />
        ) : (
          <BsFillPersonFill size={32} />
        )}
        Profile
      </Link>
    </div>
  );
};

export const MainHeader = () => {
  return (
    <div className="flex h-screen grow flex-col items-end">
      <div className="flex w-fit flex-grow flex-col items-start justify-between pb-4 pr-4 pt-8">
        <HeaderItems />
        <AccountMenu />
      </div>
    </div>
  );
};
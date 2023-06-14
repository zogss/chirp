import { useUser } from "@clerk/nextjs";
import { capitalCase } from "change-case";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useMemo } from "react";
import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import { BsArrowLeftShort, BsFillPersonFill, BsPerson } from "react-icons/bs";

import { AccountMenu } from "./accountMenu";

const HeaderItems = () => {
  //* hooks
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  //* render
  if (!isSignedIn) return null;

  return (
    <div className="flex w-full items-center justify-evenly gap-2 sm:w-auto sm:flex-col sm:items-start sm:justify-end md:justify-start">
      <Link
        href="/"
        aria-label="Go to home page"
        className={clsx(
          "flex items-center gap-4 rounded-full p-2.5 text-base transition-all hover:bg-slate-200 hover:bg-opacity-10 md:py-2.5 md:pl-4 md:pr-8",
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
        <span className="hidden md:block">Home</span>
      </Link>
      <Link
        href={`/${(isLoaded && user.username) || ""}`}
        aria-label="Go to profile page"
        className={clsx(
          "flex items-center gap-4 rounded-full p-2.5 text-base transition-all hover:bg-slate-200 hover:bg-opacity-10 md:py-2.5 md:pl-4 md:pr-8",
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
        <span className="hidden md:block">Profile</span>
      </Link>
    </div>
  );
};

export const MainHeader = () => (
  <div className="flex w-full items-start justify-between px-4 py-2 shadow-outline-white sm:w-fit sm:grow sm:flex-col sm:pb-4 sm:pl-4 sm:pr-4 sm:pt-8 sm:shadow-none md:pl-0">
    <HeaderItems />
    <AccountMenu />
  </div>
);

export const NavigationHeader = () => {
  //* hooks
  const router = useRouter();

  //* memos
  const renderTitle = useMemo(() => {
    switch (router.pathname) {
      case "/":
        return "Home";
      case "/[slug]":
        return router.query.slug as string;
      case "/post/[id]":
        return "Post";
      default:
        return "Unknown";
    }
  }, [router.pathname, router.query.slug]);

  //* handlers
  const handleBack = useCallback(() => {
    if (router.pathname !== "/") {
      router.back();
    }
  }, [router]);

  //* render
  return (
    <div className="flex w-full gap-4 p-4">
      {router.pathname !== "/" && (
        <button
          type="button"
          title="Back button"
          onClick={handleBack}
          className="text-gray-300"
        >
          <BsArrowLeftShort size={28} />
        </button>
      )}
      <h2 className="text-xl font-bold">{renderTitle}</h2>
    </div>
  );
};

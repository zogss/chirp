import { SignInButton, useUser } from "@clerk/nextjs";
import { capitalCase } from "change-case";
import { useRouter } from "next/router";
import React, { useCallback, useMemo, type PropsWithChildren } from "react";
import { BsArrowLeftShort } from "react-icons/bs";
import { useLayout } from "~/hooks/useLayout";
import { MainHeader } from "./header";
import { SideBar } from "./sideBar";
import Link from "next/link";

export const PageLayout = ({ children }: PropsWithChildren) => {
  //* hooks
  const {
    columnsWidth: { leftWidth, mainWidth, rightWidth },
  } = useLayout();
  const { isSignedIn } = useUser();
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
    <main className="flex min-h-screen flex-col-reverse justify-center sm:flex-row">
      <div
        className="sticky bottom-0 z-10 flex flex-col items-end bg-black sm:bottom-auto sm:top-0 sm:h-screen sm:grow sm:bg-transparent"
        style={{
          width: leftWidth,
        }}
      >
        <MainHeader />
      </div>
      <div
        className="flex grow flex-col border-x border-slate-700 md:max-w-2xl"
        style={{
          width: mainWidth,
        }}
      >
        <div className="flex w-full gap-4 p-4">
          {router.pathname !== "/" && (
            <button
              type="button"
              title=""
              onClick={handleBack}
              className="text-gray-300"
            >
              <BsArrowLeftShort size={28} />
            </button>
          )}
          <h2 className="text-xl font-bold">{capitalCase(renderTitle)}</h2>
        </div>
        {children}
      </div>
      <div
        className="sticky top-0 hidden h-screen grow flex-col items-start sm:flex"
        style={{
          width: rightWidth,
        }}
      >
        <SideBar />
      </div>
      {!isSignedIn && (
        <div className="fixed bottom-0 z-20 flex w-full items-center justify-center bg-black px-3 py-5 shadow-outline-white lg:hidden">
          <SignInButton mode="modal">
            <button
              type="button"
              title="Click to sign in"
              className="flex w-1/2 justify-center rounded-full bg-black px-4 py-1.5 text-sm font-semibold text-white shadow-outline-white transition-all hover:bg-white hover:bg-opacity-10 md:w-1/3"
            >
              Sign in
            </button>
          </SignInButton>
        </div>
      )}
    </main>
  );
};

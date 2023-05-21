import { useUser, useClerk } from "@clerk/nextjs";
import { Menu, Transition } from "@headlessui/react";
import Image from "next/image";
import React, { Fragment } from "react";
import { BsThreeDots } from "react-icons/bs";

const AccountButtonSkeleton = () => (
  <div className="flex items-center gap-3">
    <div className="h-10 w-10 rounded-full bg-gray-600"></div>
    <div className="flex flex-col gap-1">
      <div className="h-4 w-20 rounded bg-gray-600"></div>
      <div className="h-3 w-16 rounded bg-gray-600"></div>
    </div>
    <div className="ml-14 h-1 w-3 rounded bg-gray-600"></div>
  </div>
);

export const AccountMenu = () => {
  //* hooks
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();

  //* render
  if (!isSignedIn) return null;

  return (
    <Menu as="div" className="relative flex w-full shrink-0 text-left">
      <div className="flex shrink-0 justify-end">
        <Menu.Button className="flex w-fit items-center justify-start gap-3 rounded-full p-2 text-sm font-medium text-white transition-all hover:bg-slate-200 hover:bg-opacity-10 md:p-3 md:pr-4 lg:w-full">
          {isLoaded ? (
            <>
              <Image
                src={user.profileImageUrl}
                alt={`${user.username || ""}'s profile image`}
                width={40}
                height={40}
                className="shrink-0 rounded-full"
              />
              <div className="hidden flex-col items-start justify-start md:flex">
                <h6 className="text-base font-semibold text-white">
                  {user.firstName}
                </h6>
                <span className="text-gray-600">{`@${
                  user.username || ""
                }`}</span>
              </div>
              <BsThreeDots className="hidden md:ml-2 lg:ml-8 lg:block xl:ml-14" />
            </>
          ) : (
            <AccountButtonSkeleton />
          )}
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          as="div"
          className="absolute bottom-16 left-0 z-10 mb-2 w-56 origin-bottom-right rounded-xl bg-black py-4 shadow-outline-white"
        >
          <Menu.Item>
            <button
              type="button"
              title="Sign out"
              onClick={() => void signOut()}
              className="flex w-full items-center px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-200 hover:bg-opacity-10"
            >
              Log out @{user.username}
            </button>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

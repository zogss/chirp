import { useClerk, useUser } from "@clerk/nextjs";
import { Menu, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import ProfileManagementModal from "../profileManagementModal";

const ProfileManagementButton = () => {
  //* hooks
  const { signOut } = useClerk();
  const { asPath } = useRouter();
  const { user, isSignedIn } = useUser();

  //* states
  const [isOpen, setIsOpen] = useState(false);

  //* handlers
  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  //* render
  if (!user || !isSignedIn) return null;

  if (asPath !== `/${user.username || ""}`) return null;

  return (
    <>
      <Menu as="div" className="relative flex shrink-0">
        <Menu.Button className="rounded-full border border-white px-3.5 py-1.5 text-base transition-all hover:bg-white hover:bg-opacity-10">
          Edit profile
        </Menu.Button>
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
            className="absolute right-0 top-11 z-10 mb-2 w-60 origin-top-right rounded-xl bg-black py-4 shadow-outline-white md:w-72 lg:w-80"
          >
            <div className="flex w-full items-center justify-start gap-2 px-6">
              <Image
                src={user.profileImageUrl || ""}
                alt={`${user.username || ""} - profile image`}
                width={44}
                height={44}
                className="rounded-full"
              />
              <div className="flex flex-col">
                <h1 className="text-sm font-semibold text-white">
                  {user.fullName}
                </h1>
                <h2 className="text-xs font-semibold text-gray-500">{`@${
                  user.username || ""
                }`}</h2>
              </div>
            </div>
            <div className="mt-3">
              <Menu.Item>
                <button
                  type="button"
                  title="Manage account"
                  onClick={onOpen}
                  className="flex w-full items-center gap-4 px-4 py-3 pl-10 text-sm text-gray-400 transition-all hover:bg-slate-200 hover:bg-opacity-10 hover:text-white"
                >
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    width={12}
                    height={12}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.49 1.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 0 1-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 0 1 .947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 0 1 2.287.947c.379 1.561 2.6 1.561 2.978 0a1.532 1.532 0 0 1 2.287-.947c1.372.836 2.942-.734 2.106-2.106a1.532 1.532 0 0 1 .947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 0 1-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 0 1-2.287-.947ZM8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  Manage account
                </button>
              </Menu.Item>
              <Menu.Item>
                <button
                  type="button"
                  title="Sign out"
                  onClick={() => void signOut()}
                  className="flex w-full items-center gap-4 px-4 py-3 pl-10 text-sm text-gray-400 transition-all hover:bg-slate-200 hover:bg-opacity-10 hover:text-white"
                >
                  <svg
                    viewBox="0 0 15 16"
                    fill="none"
                    width={12}
                    height={12}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 0a1 1 0 0 0-1 1v12a1 1 0 1 0 2 0V1a1 1 0 0 0-1-1Zm10.293 9.293a1 1 0 0 0 1.414 1.414l3-3a1 1 0 0 0 0-1.414l-3-3a1 1 0 1 0-1.414 1.414L12.586 6H5a1 1 0 1 0 0 2h7.586l-1.293 1.293Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  Sign out
                </button>
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
      <ProfileManagementModal isOpen={isOpen} closeModal={onClose} />
    </>
  );
};

export default ProfileManagementButton;

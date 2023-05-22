import { UserProfile } from "@clerk/nextjs";
import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { IoClose } from "react-icons/io5";

interface ProfileManagementModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const ProfileManagementModal = ({
  isOpen,
  closeModal,
}: ProfileManagementModalProps) => (
  <Transition appear show={isOpen} as={Fragment}>
    <Dialog as="div" className="relative z-10" onClose={closeModal}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black bg-opacity-50" />
      </Transition.Child>

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center text-center md:p-5">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel>
              <UserProfile
                appearance={{
                  elements: {
                    card: "m-0 rounded-none md:rounded-2xl max-w-[100vw]",
                  },
                }}
              />
              <button
                type="button"
                onClick={closeModal}
                className="fixed right-4 top-4 rounded-md bg-black p-2 text-base shadow-outline-white transition-all hover:bg-white hover:bg-opacity-10"
              >
                <IoClose />
              </button>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
);

export default ProfileManagementModal;

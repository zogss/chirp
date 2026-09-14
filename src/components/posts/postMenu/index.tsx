"use client";

import { useAuth } from "@clerk/nextjs";
import {
  CloseButton,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { clsx } from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { RiDeleteBin6Line, RiLinkM, RiMoreFill } from "react-icons/ri";

import { Spinner } from "~/components/loading";
import { useTRPC, type RouterOutputs } from "~/trpc/react";

type PostWithAuthor = RouterOutputs["posts"]["getById"];
type Feed = InfiniteData<RouterOutputs["posts"]["infinite"]>;

const menuItemClassName =
  "flex w-full items-center gap-3 px-4 py-3 text-left font-bold transition-colors data-focus:bg-white/3";

interface PostMenuProps extends PostWithAuthor {
  className?: string;
}

export const PostMenu = ({ post, author, className }: PostMenuProps) => {
  //* hooks
  const { userId } = useAuth();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  //* states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const { mutate: deletePost, isPending: isDeleting } = useMutation(
    trpc.posts.delete.mutationOptions({
      onSuccess: ({ id }) => {
        setIsConfirmOpen(false);

        // remove the post from every loaded feed right away
        queryClient.setQueriesData<Feed>(
          trpc.posts.infinite.pathFilter(),
          (feed) =>
            feed && {
              ...feed,
              pages: feed.pages.map((page) => ({
                ...page,
                posts: page.posts.filter((item) => item.post.id !== id),
              })),
            },
        );
        // post counts and "recently chirping" changed too
        void queryClient.invalidateQueries(trpc.profile.pathFilter());

        toast.success("Your chirp was deleted");

        if (pathname === `/post/${id}`) router.replace(`/${author.username}`);
      },
      onError: () => {
        toast.error("Couldn't delete your chirp. Please try again.");
      },
    }),
  );

  //* handlers
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        new URL(`/post/${post.id}`, window.location.origin).toString(),
      );
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Couldn't copy the link");
    }
  };

  //* render
  return (
    <>
      <Menu>
        <MenuButton
          aria-label="More"
          className={clsx(
            "-my-2 -mr-2 flex size-8.5 shrink-0 items-center justify-center rounded-full text-muted transition-colors outline-none hover:bg-brand/10 hover:text-brand data-focus:bg-brand/10 data-focus:text-brand data-open:text-brand",
            className,
          )}
        >
          <RiMoreFill size={18} />
        </MenuButton>
        <MenuItems
          anchor="bottom end"
          transition
          className="z-40 min-w-60 overflow-hidden rounded-xl bg-black py-1 shadow-popover transition duration-100 ease-out outline-none data-closed:scale-95 data-closed:opacity-0"
        >
          {userId === post.authorId && (
            <MenuItem>
              <button
                type="button"
                onClick={() => setIsConfirmOpen(true)}
                className={clsx(menuItemClassName, "text-danger")}
              >
                <RiDeleteBin6Line size={18} />
                Delete
              </button>
            </MenuItem>
          )}
          <MenuItem>
            <button
              type="button"
              onClick={() => void copyLink()}
              className={menuItemClassName}
            >
              <RiLinkM size={18} />
              Copy link to chirp
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>

      <Dialog
        open={isConfirmOpen}
        onClose={() => {
          if (!isDeleting) setIsConfirmOpen(false);
        }}
        className="relative z-50"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-backdrop transition-opacity duration-150 data-closed:opacity-0"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-[320px] rounded-2xl bg-black p-8 transition duration-150 ease-out data-closed:scale-95 data-closed:opacity-0"
          >
            <DialogTitle className="text-xl leading-6 font-bold">
              Delete chirp?
            </DialogTitle>
            <p className="mt-2 text-muted">
              This can&apos;t be undone and it will be removed from your profile
              and from the timeline of everyone on Chirp.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => deletePost({ id: post.id })}
                className="flex h-11 items-center justify-center gap-2 rounded-full bg-danger font-bold text-white transition-colors hover:bg-danger/90 disabled:opacity-50"
              >
                {isDeleting && <Spinner size={16} tone="current" />}
                Delete
              </button>
              <CloseButton
                disabled={isDeleting}
                className="h-11 rounded-full border border-line-strong font-bold transition-colors hover:bg-foreground/10 disabled:opacity-50"
              >
                Cancel
              </CloseButton>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

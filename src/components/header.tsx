"use client";

import { useRouter } from "next/navigation";
import { RiArrowLeftLine } from "react-icons/ri";

interface NavigationHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
}

/** Sticky, translucent page header at the top of the main column. */
export const NavigationHeader = ({
  title,
  subtitle,
  showBackButton = true,
}: NavigationHeaderProps) => {
  //* hooks
  const router = useRouter();

  //* handlers
  const handleBack = () => {
    // visitors that landed straight on this page have nothing to go back to
    if (window.history.length > 1) router.back();
    else router.push("/");
  };

  //* render
  return (
    <header className="sticky top-0 z-20 flex h-13.25 shrink-0 items-center gap-6 bg-black/65 px-4 backdrop-blur-md">
      {showBackButton && (
        <button
          type="button"
          aria-label="Back"
          onClick={handleBack}
          className="-ml-2 flex size-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-foreground/10"
        >
          <RiArrowLeftLine size={20} />
        </button>
      )}
      <div className="min-w-0">
        <h1 className="truncate text-xl leading-6 font-bold">{title}</h1>
        {subtitle && (
          <p className="truncate text-[13px] leading-4 text-muted">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
};

import type { PropsWithChildren } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
}

export const EmptyState = ({
  title,
  description,
  children,
}: PropsWithChildren<EmptyStateProps>) => (
  <div className="mx-auto flex w-full max-w-100 flex-col gap-2 px-8 py-10">
    <h2 className="text-[31px] leading-9 font-extrabold wrap-break-word">
      {title}
    </h2>
    {description && <p className="text-muted">{description}</p>}
    {children && <div className="mt-5">{children}</div>}
  </div>
);

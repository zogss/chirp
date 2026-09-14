import { clsx } from "clsx";

interface SpinnerProps {
  size?: number;
  /** `brand` is the blue Twitter spinner, `current` follows the text color (e.g. inside buttons). */
  tone?: "brand" | "current";
  className?: string;
}

const CIRCUMFERENCE = 2 * Math.PI * 14;

export const Spinner = ({
  size = 26,
  tone = "brand",
  className,
}: SpinnerProps) => (
  <svg
    viewBox="0 0 32 32"
    width={size}
    height={size}
    role="status"
    aria-label="Loading"
    className={clsx("animate-spin", className)}
  >
    <circle
      cx="16"
      cy="16"
      r="14"
      fill="none"
      strokeWidth="4"
      className={tone === "brand" ? "stroke-brand/20" : "stroke-current/25"}
    />
    <circle
      cx="16"
      cy="16"
      r="14"
      fill="none"
      strokeWidth="4"
      strokeLinecap="round"
      strokeDasharray={CIRCUMFERENCE}
      strokeDashoffset={CIRCUMFERENCE * 0.75}
      className={tone === "brand" ? "stroke-brand" : "stroke-current"}
    />
  </svg>
);

export const LoadingSpinner = () => (
  <div className="flex w-full justify-center py-6">
    <Spinner />
  </div>
);

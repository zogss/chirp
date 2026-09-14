"use client";

import { useSyncExternalStore } from "react";

import {
  formatFullTime,
  formatJoinedDate,
  formatShortTime,
} from "~/utils/date";

const TICK = 30 * 1000;

const subscribe = (onTick: () => void) => {
  const interval = setInterval(onTick, TICK);
  return () => clearInterval(interval);
};

// Rounded, so the snapshot stays the same between renders and only changes once per tick
const getSnapshot = () => Math.floor(Date.now() / TICK) * TICK;

// On the server this is the render time. While hydrating on the client it's 0, which renders an
// empty label (the server text is kept) and forces a re-render right after hydration, formatting
// the date with the viewer's clock and timezone.
const getServerSnapshot = () =>
  typeof window === "undefined" ? getSnapshot() : 0;

const formatters = {
  relative: formatShortTime,
  full: formatFullTime,
  joined: formatJoinedDate,
};

interface TimestampProps {
  date: Date;
  variant?: keyof typeof formatters;
  className?: string;
}

export const Timestamp = ({
  date,
  variant = "relative",
  className,
}: TimestampProps) => {
  //* hooks
  const now = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isHydrating = now === 0;

  //* render
  return (
    <time
      dateTime={date.toISOString()}
      title={isHydrating ? undefined : formatFullTime(date)}
      className={className}
      suppressHydrationWarning
    >
      {isHydrating ? "" : formatters[variant](date, new Date(now))}
    </time>
  );
};

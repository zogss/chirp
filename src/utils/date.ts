const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** Twitter-style short timestamp: "now", "42s", "5m", "3h", "Mar 4" or "Mar 4, 2023". */
export const formatShortTime = (date: Date, now: Date) => {
  const elapsed = now.getTime() - date.getTime();

  if (elapsed < SECOND) return "now";
  if (elapsed < MINUTE) return `${Math.floor(elapsed / SECOND)}s`;
  if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)}m`;
  if (elapsed < DAY) return `${Math.floor(elapsed / HOUR)}h`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() === now.getFullYear() ? undefined : "numeric",
  });
};

/** "3:45 PM · Mar 4, 2023" */
export const formatFullTime = (date: Date) =>
  `${date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })} · ${date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;

/** "Joined March 2023" */
export const formatJoinedDate = (date: Date) =>
  `Joined ${date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })}`;

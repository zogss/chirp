import { clsx } from "clsx";
import Image from "next/image";

interface AvatarProps {
  src: string;
  username: string;
  size: number;
  className?: string;
}

export const Avatar = ({ src, username, size, className }: AvatarProps) => (
  <Image
    src={src}
    alt={`@${username}'s profile picture`}
    width={size}
    height={size}
    style={{ width: size, height: size }}
    className={clsx("shrink-0 rounded-full bg-surface object-cover", className)}
  />
);

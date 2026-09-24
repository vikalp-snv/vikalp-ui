import { forwardRef, useState, type HTMLAttributes, type ReactNode } from "react";

import { cx } from "../../utils/cx";
import "./Avatar.css";

export type AvatarSize = "sm" | "md" | "lg";

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  src?: string;
  /** Required: the person's name, or "" when a nearby name already labels it. */
  alt: string;
  /** Shown when there is no src or it fails to load. Default: initials of alt. */
  fallback?: ReactNode;
  size?: AvatarSize;
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { src, alt, fallback, size = "md", className, ...props },
  ref,
) {
  // Remember which src failed, so a new src gets a fresh attempt
  const [failedSrc, setFailedSrc] = useState<string>();
  const showImage = src !== undefined && src !== failedSrc;
  // The fallback is decorative; the root carries the name instead
  const named = !showImage && alt !== "";

  return (
    <span
      {...props}
      ref={ref}
      role={named ? "img" : undefined}
      aria-label={named ? alt : undefined}
      className={cx("ui-avatar", `ui-avatar-${size}`, className)}
    >
      {showImage ? (
        <img src={src} alt={alt} onError={() => setFailedSrc(src)} />
      ) : (
        <span aria-hidden="true">{fallback ?? initials(alt)}</span>
      )}
    </span>
  );
});

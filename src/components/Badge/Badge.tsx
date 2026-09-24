import type { HTMLAttributes } from "react";

import "./Badge.css";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "primary"
    | "solid"
    | "neutral"
    | "success"
    | "warning"
    | "error"
    | "info";
}

export function Badge({ variant = "primary", className, ...props }: BadgeProps) {
  return (
    <span
      {...props}
      className={["ui-badge", `ui-badge-${variant}`, className]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

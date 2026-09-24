import { forwardRef, type HTMLAttributes } from "react";

import { cx } from "../../utils/cx";
import "./Badge.css";

export type BadgeVariant =
  | "primary"
  | "solid"
  | "neutral"
  | "success"
  | "warning"
  | "error"
  | "info";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = "primary", className, ...props },
  ref,
) {
  return (
    <span
      {...props}
      ref={ref}
      className={cx("ui-badge", `ui-badge-${variant}`, className)}
    />
  );
});

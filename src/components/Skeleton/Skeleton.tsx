import { forwardRef, type HTMLAttributes } from "react";

import { cx } from "../../utils/cx";
import "./Skeleton.css";

export type SkeletonShape = "rect" | "circle";

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  /** Any CSS length; numbers are px. Default: full width. */
  width?: string | number;
  /** Any CSS length; numbers are px. Default: 1em (one text line). */
  height?: string | number;
  shape?: SkeletonShape;
}

/**
 * Decorative placeholder, hidden from assistive tech. Mark the region that
 * is loading with aria-busy="true" instead.
 */
export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(
  function Skeleton({ width, height, shape = "rect", className, style, ...props }, ref) {
    return (
      <span
        aria-hidden="true"
        {...props}
        ref={ref}
        className={cx("ui-skeleton", `ui-skeleton-${shape}`, className)}
        style={{ width, height, ...style }}
      />
    );
  },
);

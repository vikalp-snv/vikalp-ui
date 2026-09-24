import { forwardRef, type HTMLAttributes } from "react";

import { cx } from "../../utils/cx";
import "./Heading.css";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";

const sizeForLevel: Record<HeadingLevel, HeadingSize> = {
  1: "4xl",
  2: "3xl",
  3: "2xl",
  4: "xl",
  5: "lg",
  6: "md",
};

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Required: the document outline level (h1–h6). */
  level: HeadingLevel;
  /** Visual size, when it should differ from the level's default. */
  size?: HeadingSize;
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  function Heading({ level, size = sizeForLevel[level], className, ...props }, ref) {
    const Tag = `h${level}` as const;
    return (
      <Tag
        {...props}
        ref={ref}
        className={cx("ui-heading", `ui-heading-${size}`, className)}
      />
    );
  },
);

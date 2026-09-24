import { forwardRef, type ElementType, type HTMLAttributes } from "react";

import { cx } from "../../utils/cx";
import "./Text.css";

export type TextElement = "p" | "span" | "div" | "strong" | "em" | "small";
export type TextSize = "xs" | "sm" | "md" | "lg";
export type TextWeight = "regular" | "bold";
/** Only tones that pass text contrast on the Simnovus palette (see README). */
export type TextTone = "default" | "muted" | "error";
export type TextAlign = "start" | "center" | "end";

export interface TextProps extends HTMLAttributes<HTMLElement> {
  /** Element to render. Defaults to `p`. */
  as?: TextElement;
  /** Unset props inherit from the parent, so Text composes inside other components. */
  size?: TextSize;
  weight?: TextWeight;
  tone?: TextTone;
  align?: TextAlign;
  /** Single line with an ellipsis. */
  truncate?: boolean;
  /** Ubuntu Mono, for logs, IDs and technical output. */
  mono?: boolean;
}

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  {
    as = "p",
    size,
    weight,
    tone,
    align,
    truncate = false,
    mono = false,
    className,
    ...props
  },
  ref,
) {
  const Component = as as ElementType;
  return (
    <Component
      {...props}
      ref={ref}
      className={cx(
        "ui-text",
        size && `ui-text-${size}`,
        weight && `ui-text-${weight}`,
        tone && `ui-text-${tone}`,
        align && `ui-text-${align}`,
        truncate && "ui-text-truncate",
        mono && "ui-text-mono",
        className,
      )}
    />
  );
});

import { forwardRef, type HTMLAttributes } from "react";

import { cx } from "../../utils/cx";
import "./Spinner.css";

export type SpinnerSize = "sm" | "md" | "lg";

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize;
  /**
   * Announced text inside a role="status" region. Pass "" when something
   * else already announces the loading, and the spinner becomes decorative.
   */
  label?: string;
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = "md", label = "Loading", className, ...props },
  ref,
) {
  return (
    <span
      role={label ? "status" : undefined}
      aria-hidden={label ? undefined : true}
      {...props}
      ref={ref}
      className={cx("ui-spinner", `ui-spinner-${size}`, className)}
    >
      {label && <span className="ui-spinner-label">{label}</span>}
    </span>
  );
});

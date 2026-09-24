import { forwardRef, type HTMLAttributes } from "react";

import { cx } from "../../utils/cx";
import "./Divider.css";

export type DividerOrientation = "horizontal" | "vertical";

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: DividerOrientation;
}

/** Native <hr> (role "separator"); vertical adds aria-orientation. */
export const Divider = forwardRef<HTMLHRElement, DividerProps>(function Divider(
  { orientation = "horizontal", className, ...props },
  ref,
) {
  return (
    <hr
      {...props}
      ref={ref}
      aria-orientation={orientation === "vertical" ? "vertical" : undefined}
      className={cx("ui-divider", `ui-divider-${orientation}`, className)}
    />
  );
});

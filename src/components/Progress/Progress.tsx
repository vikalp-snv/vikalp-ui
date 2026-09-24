import { forwardRef, type ProgressHTMLAttributes } from "react";

import { cx } from "../../utils/cx";
import "./Progress.css";

export type ProgressProps = ProgressHTMLAttributes<HTMLProgressElement>;

/**
 * Native <progress> (role "progressbar"). Omit `value` for indeterminate.
 * Give it a name with aria-label, aria-labelledby or <label htmlFor>.
 */
export const Progress = forwardRef<HTMLProgressElement, ProgressProps>(
  function Progress({ className, ...props }, ref) {
    return <progress {...props} ref={ref} className={cx("ui-progress", className)} />;
  },
);

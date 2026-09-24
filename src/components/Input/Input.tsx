import { forwardRef, type InputHTMLAttributes } from "react";

import { cx } from "../../utils/cx";
import "./Input.css";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

/**
 * Native input. States come from the platform: :disabled, :focus-visible,
 * aria-invalid. Label it with a <label> or aria-label; the library adds none.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref,
) {
  return <input {...props} ref={ref} className={cx("ui-input", className)} />;
});

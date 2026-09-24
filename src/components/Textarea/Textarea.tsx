import { forwardRef, type TextareaHTMLAttributes } from "react";

import { cx } from "../../utils/cx";
import "../Input/Input.css";
import "./Textarea.css";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

/**
 * Native textarea. Shares Input's field styles (focus, aria-invalid,
 * disabled, placeholder); resizes vertically, override with style={{ resize }}.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        {...props}
        ref={ref}
        className={cx("ui-input", "ui-textarea", className)}
      />
    );
  },
);

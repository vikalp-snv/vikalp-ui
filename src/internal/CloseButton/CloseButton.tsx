import { forwardRef, type ButtonHTMLAttributes } from "react";

import { cx } from "../../utils/cx";
import "./CloseButton.css";

interface CloseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible name; the button shows only an × icon. */
  label: string;
}

/** Internal: the × button shared by Dialog and Toast. */
export const CloseButton = forwardRef<HTMLButtonElement, CloseButtonProps>(
  function CloseButton({ label, className, ...props }, ref) {
    return (
      <button
        type="button"
        aria-label={label}
        {...props}
        ref={ref}
        className={cx("ui-close-button", className)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    );
  },
);

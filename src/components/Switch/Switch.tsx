import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

import { ChoiceLabel } from "../../internal/ChoiceLabel/ChoiceLabel";
import { cx } from "../../utils/cx";
import "./Switch.css";

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "role"> {
  /** Wraps the switch in a <label>. Omit it to label the input yourself. */
  label?: ReactNode;
}

/**
 * A native checkbox with role="switch": Space toggles it, forms submit it,
 * and screen readers announce "switch, on/off".
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, className, ...props },
  ref,
) {
  return (
    <ChoiceLabel label={label}>
      <input
        {...props}
        ref={ref}
        type="checkbox"
        role="switch"
        className={cx("ui-choice-control", "ui-switch", className)}
      />
    </ChoiceLabel>
  );
});

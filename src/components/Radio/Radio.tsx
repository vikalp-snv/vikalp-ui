import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

import { ChoiceLabel } from "../../internal/ChoiceLabel/ChoiceLabel";
import { cx } from "../../utils/cx";
import "./Radio.css";

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Wraps the radio in a <label>. Omit it to label the input yourself. */
  label?: ReactNode;
}

/**
 * Native <input type="radio">. Radios sharing a `name` form a group with
 * native arrow-key navigation; wrap them in <fieldset> + <legend>.
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, className, ...props },
  ref,
) {
  return (
    <ChoiceLabel label={label}>
      <input
        {...props}
        ref={ref}
        type="radio"
        className={cx("ui-choice-control", "ui-radio", className)}
      />
    </ChoiceLabel>
  );
});

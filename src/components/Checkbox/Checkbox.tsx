import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

import { ChoiceLabel } from "../../internal/ChoiceLabel/ChoiceLabel";
import { cx } from "../../utils/cx";
import "./Checkbox.css";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Wraps the checkbox in a <label>. Omit it to label the input yourself. */
  label?: ReactNode;
  /** Mixed state; browsers expose it to assistive tech as "mixed". */
  indeterminate?: boolean;
}

/** Native <input type="checkbox">. Props, ref and className go to the input. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox({ label, indeterminate = false, className, ...props }, ref) {
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current!, []);

    // Not an HTML attribute, only a DOM property. Re-applied on every render
    // because a click clears it natively.
    useEffect(() => {
      if (inputRef.current) inputRef.current.indeterminate = indeterminate;
    });

    return (
      <ChoiceLabel label={label}>
        <input
          {...props}
          ref={inputRef}
          type="checkbox"
          className={cx("ui-choice-control", "ui-checkbox", className)}
        />
      </ChoiceLabel>
    );
  },
);

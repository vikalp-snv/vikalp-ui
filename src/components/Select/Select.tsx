import { forwardRef, type SelectHTMLAttributes } from "react";

import { cx } from "../../utils/cx";
import "../Input/Input.css";
import "./Select.css";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Shorthand for <option> children; any children render after these. */
  options?: SelectOption[];
}

/**
 * Native <select>: keyboard, type-ahead and the mobile picker come from the
 * browser. Shares Input's field styles. A custom combobox is a later phase.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { options, className, children, ...props },
  ref,
) {
  return (
    <select {...props} ref={ref} className={cx("ui-input", "ui-select", className)}>
      {options?.map((option) => (
        <option key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </option>
      ))}
      {children}
    </select>
  );
});

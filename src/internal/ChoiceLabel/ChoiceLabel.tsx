import type { ReactElement, ReactNode } from "react";

import "./ChoiceLabel.css";

/**
 * Internal: shared by Checkbox, Radio and Switch. Wraps the control in a
 * <label> only when a label is given, so the label is associated natively
 * (click-to-toggle, accessible name) with no id wiring.
 */
export function ChoiceLabel({
  label,
  children,
}: {
  label?: ReactNode;
  children: ReactElement;
}) {
  if (label == null) return children;
  return (
    <label className="ui-choice">
      {children}
      <span className="ui-choice-label">{label}</span>
    </label>
  );
}

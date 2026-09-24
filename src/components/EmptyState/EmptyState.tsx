import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

import { cx } from "../../utils/cx";
import "./EmptyState.css";

export interface EmptyStateProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Rendered in a <div>, so a <Heading> can be passed when the outline needs one. */
  title: ReactNode;
  description?: ReactNode;
  /** Decorative visual, hidden from assistive tech. */
  icon?: ReactNode;
  /** Usually a Button. */
  action?: ReactNode;
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  function EmptyState({ title, description, icon, action, className, children, ...props }, ref) {
    return (
      <div {...props} ref={ref} className={cx("ui-empty-state", className)}>
        {icon != null && (
          <div className="ui-empty-state-icon" aria-hidden="true">
            {icon}
          </div>
        )}
        <div className="ui-empty-state-title">{title}</div>
        {description != null && (
          <div className="ui-empty-state-description">{description}</div>
        )}
        {action != null && <div className="ui-empty-state-action">{action}</div>}
        {children}
      </div>
    );
  },
);

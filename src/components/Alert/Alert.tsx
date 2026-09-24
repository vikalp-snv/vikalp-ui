import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

import { cx } from "../../utils/cx";
import "./Alert.css";

export type AlertVariant = "info" | "success" | "warning" | "error";

// Shape as well as color tells the variants apart (WCAG 1.4.1)
const icons: Record<AlertVariant, ReactNode> = {
  info: <path d="M12 16v-4M12 8h.01" />,
  success: <path d="m8.5 12 2.5 2.5 4.5-5" />,
  warning: <path d="M12 8v4M12 16h.01" />,
  error: <path d="m15 9-6 6M9 9l6 6" />,
};

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: AlertVariant;
  title?: ReactNode;
  /** Replaces the variant icon; pass null for none. */
  icon?: ReactNode;
}

/**
 * Static message box; children are the description. It has no live-region
 * role by default, because static page content should not be announced on
 * load. For an alert inserted after an event, pass role="alert" (urgent) or
 * role="status" (polite).
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { variant = "info", title, icon, className, children, ...props },
  ref,
) {
  const visual =
    icon === undefined ? (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {variant === "warning" ? (
          <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
        ) : (
          <circle cx="12" cy="12" r="10" />
        )}
        {icons[variant]}
      </svg>
    ) : (
      icon
    );

  return (
    <div {...props} ref={ref} className={cx("ui-alert", `ui-alert-${variant}`, className)}>
      {visual != null && (
        <span className="ui-alert-icon" aria-hidden="true">
          {visual}
        </span>
      )}
      <div className="ui-alert-content">
        {title != null && <div className="ui-alert-title">{title}</div>}
        {children != null && <div className="ui-alert-description">{children}</div>}
      </div>
    </div>
  );
});

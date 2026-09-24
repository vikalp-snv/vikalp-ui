import { forwardRef, type HTMLAttributes } from "react";

import { cx } from "../../utils/cx";
import "./Card.css";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Hover lift + primary border, for cards that act as a link target. */
  interactive?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { interactive = false, className, ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx("ui-card", interactive && "ui-card-interactive", className)}
    />
  );
});

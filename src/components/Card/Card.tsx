import type { HTMLAttributes } from "react";

import "./Card.css";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Hover lift + primary border, for cards that act as a link target. */
  interactive?: boolean;
}

export function Card({ interactive = false, className, ...props }: CardProps) {
  return (
    <div
      {...props}
      className={["ui-card", interactive && "ui-card-interactive", className]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

import { forwardRef, type HTMLAttributes, type Ref } from "react";

import { cx } from "../../utils/cx";
import "./List.css";

export type ListVariant = "default" | "plain" | "divided";

export interface ListProps extends HTMLAttributes<HTMLUListElement> {
  /** Renders <ol> instead of <ul>. */
  ordered?: boolean;
  /** default: markers · plain: no markers · divided: rows with separators */
  variant?: ListVariant;
}

/** Native <ul>/<ol>; children are plain <li> elements. */
export const List = forwardRef<HTMLUListElement | HTMLOListElement, ListProps>(
  function List({ ordered = false, variant = "default", className, ...props }, ref) {
    const Tag = ordered ? "ol" : "ul";
    return (
      <Tag
        // Safari drops list semantics when markers are hidden; restore them
        role={variant === "default" ? undefined : "list"}
        {...props}
        ref={ref as Ref<HTMLUListElement & HTMLOListElement>}
        className={cx("ui-list", `ui-list-${variant}`, className)}
      />
    );
  },
);

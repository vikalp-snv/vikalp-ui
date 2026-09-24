import { forwardRef, type AnchorHTMLAttributes } from "react";

import { cx } from "../../utils/cx";
import "./Link.css";

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

/**
 * Native anchor. There is no `disabled` prop: an anchor cannot be disabled,
 * but one rendered without `href` is a valid placeholder link and is styled
 * as inactive.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { className, rel, target, ...props },
  ref,
) {
  return (
    <a
      {...props}
      ref={ref}
      target={target}
      rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
      className={cx("ui-link", className)}
    />
  );
});

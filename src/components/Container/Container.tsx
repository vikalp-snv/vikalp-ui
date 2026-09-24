import { forwardRef, type ElementType, type HTMLAttributes } from "react";

import { cx } from "../../utils/cx";
import type { LayoutElement } from "../../utils/space";
import "./Container.css";

export type ContainerSize = "sm" | "md" | "lg" | "full";

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  as?: LayoutElement;
  /** Max width: sm 768px · md 1024px · lg 1280px (default) · full. */
  size?: ContainerSize;
}

export const Container = forwardRef<HTMLElement, ContainerProps>(
  function Container({ as = "div", size = "lg", className, ...props }, ref) {
    const Component = as as ElementType;
    return (
      <Component
        {...props}
        ref={ref}
        className={cx("ui-container", `ui-container-${size}`, className)}
      />
    );
  },
);

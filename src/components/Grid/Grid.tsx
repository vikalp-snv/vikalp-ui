import { forwardRef, type ElementType, type HTMLAttributes } from "react";

import { cx } from "../../utils/cx";
import { space, type LayoutElement, type Space } from "../../utils/space";
import "./Grid.css";

export type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type GridAlign = "start" | "center" | "end" | "stretch";

export interface GridProps extends HTMLAttributes<HTMLElement> {
  as?: LayoutElement;
  /** Fixed number of equal columns. */
  columns?: GridColumns;
  /**
   * Responsive alternative to `columns`: fit as many columns as possible,
   * each at least this wide (any CSS length). Wins over `columns`.
   */
  minColumnWidth?: string;
  gap?: Space;
  align?: GridAlign;
}

export const Grid = forwardRef<HTMLElement, GridProps>(function Grid(
  { as = "div", columns, minColumnWidth, gap, align, className, style, ...props },
  ref,
) {
  const Component = as as ElementType;
  const gridTemplateColumns = minColumnWidth
    ? `repeat(auto-fill, minmax(min(100%, ${minColumnWidth}), 1fr))`
    : columns && `repeat(${columns}, minmax(0, 1fr))`;
  return (
    <Component
      {...props}
      ref={ref}
      className={cx("ui-grid", className)}
      style={{
        gridTemplateColumns,
        alignItems: align,
        gap: gap === undefined ? undefined : space(gap),
        ...style,
      }}
    />
  );
});

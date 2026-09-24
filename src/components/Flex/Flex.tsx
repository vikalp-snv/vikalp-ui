import { forwardRef, type ElementType, type HTMLAttributes } from "react";

import { cx } from "../../utils/cx";
import { space, type LayoutElement, type Space } from "../../utils/space";
import "./Flex.css";

export type FlexDirection = "row" | "column" | "row-reverse" | "column-reverse";
export type FlexAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type FlexJustify = "start" | "center" | "end" | "between" | "around" | "evenly";

const alignItems: Record<FlexAlign, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
  baseline: "baseline",
};

const justifyContent: Record<FlexJustify, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  between: "space-between",
  around: "space-around",
  evenly: "space-evenly",
};

export interface FlexProps extends HTMLAttributes<HTMLElement> {
  as?: LayoutElement;
  direction?: FlexDirection;
  align?: FlexAlign;
  justify?: FlexJustify;
  wrap?: boolean;
  gap?: Space;
}

/**
 * Layout props become inline styles, and only when they are passed, so a
 * consumer's className can still set any of them when the prop is omitted.
 */
export const Flex = forwardRef<HTMLElement, FlexProps>(function Flex(
  { as = "div", direction, align, justify, wrap, gap, className, style, ...props },
  ref,
) {
  const Component = as as ElementType;
  return (
    <Component
      {...props}
      ref={ref}
      className={cx("ui-flex", className)}
      style={{
        flexDirection: direction,
        alignItems: align && alignItems[align],
        justifyContent: justify && justifyContent[justify],
        flexWrap: wrap ? "wrap" : undefined,
        gap: gap === undefined ? undefined : space(gap),
        ...style,
      }}
    />
  );
});

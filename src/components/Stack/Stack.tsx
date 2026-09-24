import { forwardRef } from "react";

import { Flex, type FlexProps } from "../Flex";

export type StackDirection = "vertical" | "horizontal";

export interface StackProps extends Omit<FlexProps, "direction" | "wrap"> {
  direction?: StackDirection;
}

/** Flex with a direction word and a default gap of 2 (12px). */
export const Stack = forwardRef<HTMLElement, StackProps>(function Stack(
  { direction = "vertical", gap = 2, ...props },
  ref,
) {
  return (
    <Flex
      {...props}
      ref={ref}
      direction={direction === "vertical" ? "column" : "row"}
      gap={gap}
    />
  );
});

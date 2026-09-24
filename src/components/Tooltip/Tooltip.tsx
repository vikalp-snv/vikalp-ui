import {
  cloneElement,
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";

import { cx } from "../../utils/cx";
import "./Tooltip.css";

export type TooltipPlacement = "top" | "bottom" | "left" | "right";

export interface TooltipProps extends Omit<HTMLAttributes<HTMLSpanElement>, "content"> {
  /** Short, non-interactive text. Anything clickable belongs in a Dropdown or Dialog. */
  content: ReactNode;
  /** One focusable element (e.g. a Button); it receives aria-describedby. */
  children: ReactElement<{ "aria-describedby"?: string }>;
  placement?: TooltipPlacement;
  /** Renders the child alone, with no tooltip. */
  disabled?: boolean;
}

const SHOW_DELAY = 300; // hover only; keyboard focus shows immediately
const HIDE_DELAY = 100; // lets the pointer cross the gap onto the tooltip (WCAG 1.4.13)

/**
 * Shows on hover and keyboard focus, hides on leave, blur or Escape.
 * Positioned with CSS around an inline wrapper, so an overflow: hidden
 * ancestor can clip it.
 */
export const Tooltip = forwardRef<HTMLSpanElement, TooltipProps>(function Tooltip(
  {
    content,
    children,
    placement = "top",
    disabled = false,
    className,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    ...props
  },
  ref,
) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  function schedule(next: boolean, delay: number) {
    clearTimeout(timer.current);
    if (delay === 0) setOpen(next);
    else timer.current = setTimeout(() => setOpen(next), delay);
  }

  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      // Consume it: an enclosing <dialog> would otherwise treat the same
      // Escape as its close request
      event.preventDefault();
      setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (disabled) return children;

  const describedBy = cx(children.props["aria-describedby"], id);

  return (
    <span
      {...props}
      ref={ref}
      className={cx("ui-tooltip-anchor", className)}
      onMouseEnter={(event) => {
        onMouseEnter?.(event);
        schedule(true, SHOW_DELAY);
      }}
      onMouseLeave={(event) => {
        onMouseLeave?.(event);
        schedule(false, HIDE_DELAY);
      }}
      onFocus={(event) => {
        onFocus?.(event);
        schedule(true, 0);
      }}
      onBlur={(event) => {
        onBlur?.(event);
        schedule(false, 0);
      }}
    >
      {cloneElement(children, { "aria-describedby": describedBy })}
      {/* Always in the DOM, so aria-describedby resolves even while hidden */}
      <span
        id={id}
        role="tooltip"
        hidden={!open}
        className={cx("ui-tooltip", `ui-tooltip-${placement}`)}
      >
        {content}
      </span>
    </span>
  );
});

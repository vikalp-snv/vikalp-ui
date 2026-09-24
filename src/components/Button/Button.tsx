import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type Ref,
} from "react";

import { cx } from "../../utils/cx";
import "./Button.css";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

type NativeButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: undefined;
  /** Shows a spinner, disables the button and sets aria-busy. */
  loading?: boolean;
};

/** Passing `href` renders an `<a>` styled as a button (the website's main use). */
type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

export type ButtonProps = ButtonStyleProps &
  (NativeButtonProps | LinkButtonProps);

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button({ variant = "primary", size = "md", className, ...props }, ref) {
  const classes = cx(
    "ui-button",
    `ui-button-${variant}`,
    `ui-button-${size}`,
    className,
  );

  if (props.href !== undefined) {
    const { rel, target } = props as LinkButtonProps;
    return (
      <a
        {...(props as LinkButtonProps)}
        ref={ref as Ref<HTMLAnchorElement>}
        className={classes}
        rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
      />
    );
  }

  const { loading = false, disabled, ...buttonProps } = props as NativeButtonProps;
  return (
    <button
      {...buttonProps}
      ref={ref as Ref<HTMLButtonElement>}
      className={cx(classes, loading && "ui-button-loading")}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    />
  );
});

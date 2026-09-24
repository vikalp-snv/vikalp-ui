import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

import "./Button.css";

interface ButtonStyleProps {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
}

type NativeButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: undefined;
};

/** Passing `href` renders an `<a>` styled as a button (the website's main use). */
type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

export type ButtonProps = ButtonStyleProps &
  (NativeButtonProps | LinkButtonProps);

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  const classes = [
    "ui-button",
    `ui-button-${variant}`,
    `ui-button-${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (props.href !== undefined) {
    const { rel, target } = props as LinkButtonProps;
    return (
      <a
        {...(props as LinkButtonProps)}
        className={classes}
        rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
      />
    );
  }

  return <button {...(props as NativeButtonProps)} className={classes} />;
}

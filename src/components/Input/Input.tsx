import type { InputHTMLAttributes } from "react";

import "./Input.css";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

/** Native input. States come from the platform: :disabled, :focus-visible, aria-invalid. */
export function Input({ className, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={["ui-input", className].filter(Boolean).join(" ")}
    />
  );
}

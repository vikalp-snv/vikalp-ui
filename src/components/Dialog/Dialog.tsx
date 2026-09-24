import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type DialogHTMLAttributes,
  type HTMLAttributes,
  type MouseEvent,
} from "react";

import { CloseButton } from "../../internal/CloseButton/CloseButton";
import { cx } from "../../utils/cx";
import { Button, type ButtonVariant } from "../Button";
import { Heading, type HeadingProps } from "../Heading";
import { Text, type TextProps } from "../Text";
import "./Dialog.css";

type Part = "title" | "description";

interface DialogContextValue {
  close: () => void;
  ids: Record<Part, string>;
  register: (part: Part, present: boolean) => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialog(component: string) {
  const context = useContext(DialogContext);
  if (!context) throw new Error(`<${component}> must be used inside <Dialog>.`);
  return context;
}

/** Lets Title/Description tell the dialog they exist, so aria-* never points at a missing id. */
function useRegister(part: Part) {
  const { ids, register } = useDialog(part === "title" ? "DialogTitle" : "DialogDescription");
  useLayoutEffect(() => {
    register(part, true);
    return () => register(part, false);
  }, [part, register]);
  return ids[part];
}

export type DialogSize = "sm" | "md" | "lg";

export interface DialogProps
  extends Omit<DialogHTMLAttributes<HTMLDialogElement>, "open"> {
  /** Controlled: the dialog shows while this is true. */
  open: boolean;
  /** Called with false on Escape, backdrop click, the × button or <DialogClose>. */
  onOpenChange: (open: boolean) => void;
  /** Max width: sm 384px · md 512px (default) · lg 672px. */
  size?: DialogSize;
  /** Accessible name of the × button. */
  closeLabel?: string;
}

/**
 * Modal built on the native <dialog> and showModal(): the browser provides
 * the backdrop, top-layer stacking, Escape, the focus trap (the rest of the
 * page becomes inert) and focus restore on close.
 */
export const Dialog = forwardRef<HTMLDialogElement, DialogProps>(function Dialog(
  {
    open,
    onOpenChange,
    size = "md",
    closeLabel = "Close",
    className,
    children,
    onCancel,
    onClose,
    onClick,
    ...props
  },
  ref,
) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useImperativeHandle(ref, () => dialogRef.current!, []);

  const id = useId();
  const ids = useMemo(() => ({ title: `${id}-title`, description: `${id}-description` }), [id]);
  const [present, setPresent] = useState<Record<Part, boolean>>({ title: false, description: false });
  const register = useCallback(
    (part: Part, isPresent: boolean) => setPresent((p) => ({ ...p, [part]: isPresent })),
    [],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);
  const context = useMemo(() => ({ close, ids, register }), [close, ids, register]);

  // A click whose target is the <dialog> itself and lands outside its box hit the backdrop
  function handleClick(event: MouseEvent<HTMLDialogElement>) {
    onClick?.(event);
    if (event.target !== event.currentTarget) return;
    const box = event.currentTarget.getBoundingClientRect();
    const inside =
      event.clientX >= box.left && event.clientX <= box.right &&
      event.clientY >= box.top && event.clientY <= box.bottom;
    if (!inside) close();
  }

  return (
    <DialogContext.Provider value={context}>
      <dialog
        aria-labelledby={present.title ? ids.title : undefined}
        aria-describedby={present.description ? ids.description : undefined}
        {...props}
        ref={dialogRef}
        className={cx("ui-dialog", `ui-dialog-${size}`, className)}
        onCancel={(event) => {
          onCancel?.(event);
          event.preventDefault(); // stay controlled: the parent decides via onOpenChange
          close();
        }}
        onClose={(event) => {
          onClose?.(event);
          // Closed by the browser itself (e.g. <form method="dialog">), not by us
          if (open) close();
        }}
        onClick={handleClick}
      >
        {children}
        {/* Last in DOM order, so initial focus lands on the content, not on × */}
        <CloseButton label={closeLabel} className="ui-dialog-close" onClick={close} />
      </dialog>
    </DialogContext.Provider>
  );
});

export type DialogHeaderProps = HTMLAttributes<HTMLDivElement>;

export const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(
  function DialogHeader({ className, ...props }, ref) {
    return <div {...props} ref={ref} className={cx("ui-dialog-header", className)} />;
  },
);

export type DialogFooterProps = HTMLAttributes<HTMLDivElement>;

export const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(
  function DialogFooter({ className, ...props }, ref) {
    return <div {...props} ref={ref} className={cx("ui-dialog-footer", className)} />;
  },
);

export type DialogTitleProps = Omit<HeadingProps, "level" | "id">;

/** An <h2>; it names the dialog through aria-labelledby. */
export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  function DialogTitle({ size = "lg", ...props }, ref) {
    const id = useRegister("title");
    return <Heading {...props} ref={ref} id={id} level={2} size={size} />;
  },
);

export type DialogDescriptionProps = Omit<TextProps, "id">;

/** Muted text; it describes the dialog through aria-describedby. */
export const DialogDescription = forwardRef<HTMLElement, DialogDescriptionProps>(
  function DialogDescription({ size = "sm", tone = "muted", ...props }, ref) {
    const id = useRegister("description");
    return <Text {...props} ref={ref} id={id} size={size} tone={tone} />;
  },
);

export interface DialogCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

/** A Button that closes the dialog; call event.preventDefault() in onClick to keep it open. */
export const DialogClose = forwardRef<HTMLButtonElement, DialogCloseProps>(
  function DialogClose({ variant = "outline", type = "button", onClick, ...props }, ref) {
    const { close } = useDialog("DialogClose");
    return (
      <Button
        {...props}
        ref={ref}
        // "button", not the native "submit": Cancel inside a form must not submit it
        type={type}
        variant={variant}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) close();
        }}
      />
    );
  },
);

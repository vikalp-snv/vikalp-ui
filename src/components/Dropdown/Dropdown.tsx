import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
} from "react";

import { cx } from "../../utils/cx";
import { Button, type ButtonSize, type ButtonVariant } from "../Button";
import "./Dropdown.css";

type FocusTarget = "first" | "last";

interface DropdownContextValue {
  open: boolean;
  /** Opening moves focus into the menu; closing with restoreFocus returns it to the trigger. */
  setOpen: (open: boolean, focus?: FocusTarget | "trigger") => void;
  focusOnOpen: FocusTarget;
  triggerId: string;
  menuId: string;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdown(component: string) {
  const context = useContext(DropdownContext);
  if (!context) throw new Error(`<${component}> must be used inside <Dropdown>.`);
  return context;
}

export type DropdownProps = HTMLAttributes<HTMLDivElement>;

/**
 * Menu button (WAI-ARIA APG pattern). Closes on Escape, Tab, choosing an
 * item, or a pointer press / focus move outside.
 */
export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(function Dropdown(
  { className, onBlur, ...props },
  ref,
) {
  const rootRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => rootRef.current!, []);
  const [open, setOpenState] = useState(false);
  const [focusOnOpen, setFocusOnOpen] = useState<FocusTarget>("first");
  const id = useId();
  const triggerId = `${id}-trigger`;

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpenState(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const context: DropdownContextValue = {
    open,
    focusOnOpen,
    triggerId,
    menuId: `${id}-menu`,
    setOpen(next, focus) {
      if (focus === "first" || focus === "last") setFocusOnOpen(focus);
      setOpenState(next);
      if (focus === "trigger") document.getElementById(triggerId)?.focus();
    },
  };

  return (
    <DropdownContext.Provider value={context}>
      <div
        {...props}
        ref={rootRef}
        className={cx("ui-dropdown", className)}
        onBlur={(event) => {
          onBlur?.(event);
          if (open && !event.currentTarget.contains(event.relatedTarget)) setOpenState(false);
        }}
      />
    </DropdownContext.Provider>
  );
});

export interface DropdownTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

/** A Button with aria-haspopup/expanded. Enter, Space, ↓ open on the first item; ↑ on the last. */
export const DropdownTrigger = forwardRef<HTMLButtonElement, DropdownTriggerProps>(
  function DropdownTrigger({ variant = "outline", onClick, onKeyDown, ...props }, ref) {
    const dropdown = useDropdown("DropdownTrigger");
    return (
      <Button
        {...props}
        ref={ref}
        id={dropdown.triggerId}
        variant={variant}
        aria-haspopup="menu"
        aria-expanded={dropdown.open}
        aria-controls={dropdown.menuId}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) dropdown.setOpen(!dropdown.open, "first");
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
          event.preventDefault();
          dropdown.setOpen(true, event.key === "ArrowUp" ? "last" : "first");
        }}
      />
    );
  },
);

export type DropdownAlign = "start" | "end";

export interface DropdownMenuProps extends HTMLAttributes<HTMLDivElement> {
  /** Which trigger edge the menu lines up with. */
  align?: DropdownAlign;
}

const itemSelector = '[role^="menuitem"]';

/** role="menu". ↑/↓ wrap, Home/End jump, Escape closes and refocuses the trigger. */
export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  function DropdownMenu({ align = "start", className, onKeyDown, ...props }, ref) {
    const dropdown = useDropdown("DropdownMenu");
    const menuRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => menuRef.current!, []);

    useEffect(() => {
      if (!dropdown.open) return;
      const items = menuRef.current?.querySelectorAll<HTMLElement>(itemSelector);
      if (!items?.length) return;
      items[dropdown.focusOnOpen === "last" ? items.length - 1 : 0].focus();
    }, [dropdown.open, dropdown.focusOnOpen]);

    function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;
      if (event.key === "Escape") {
        event.preventDefault();
        dropdown.setOpen(false, "trigger");
        return;
      }
      if (event.key === "Tab") {
        dropdown.setOpen(false); // let focus move on naturally
        return;
      }
      const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(itemSelector));
      const i = items.indexOf(document.activeElement as HTMLElement);
      const n = items.length;
      const next = {
        ArrowDown: items[(i + 1) % n],
        ArrowUp: items[(i - 1 + n) % n],
        Home: items[0],
        End: items[n - 1],
      }[event.key];
      if (!next) return;
      event.preventDefault();
      next.focus();
    }

    return (
      <div
        {...props}
        ref={menuRef}
        id={dropdown.menuId}
        role="menu"
        aria-labelledby={dropdown.triggerId}
        hidden={!dropdown.open}
        className={cx("ui-dropdown-menu", `ui-dropdown-menu-${align}`, className)}
        onKeyDown={handleKeyDown}
      />
    );
  },
);

export interface DropdownItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "role"> {
  /** Makes this a toggle (role="menuitemcheckbox") showing a check mark when true. */
  checked?: boolean;
}

/**
 * Choosing an item runs onClick, closes the menu and refocuses the trigger;
 * call event.preventDefault() to keep the menu open. Disabled items stay
 * focusable (so they can be discovered) but do nothing.
 */
export const DropdownItem = forwardRef<HTMLButtonElement, DropdownItemProps>(
  function DropdownItem({ checked, disabled, className, onClick, children, ...props }, ref) {
    const dropdown = useDropdown("DropdownItem");
    return (
      <button
        {...props}
        ref={ref}
        type="button"
        role={checked === undefined ? "menuitem" : "menuitemcheckbox"}
        aria-checked={checked}
        aria-disabled={disabled || undefined}
        tabIndex={-1}
        className={cx("ui-dropdown-item", className)}
        onClick={(event) => {
          if (disabled) return;
          onClick?.(event);
          if (!event.defaultPrevented) dropdown.setOpen(false, "trigger");
        }}
      >
        {checked !== undefined && (
          <svg className="ui-dropdown-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m5 12 5 5L20 7" />
          </svg>
        )}
        {children}
      </button>
    );
  },
);

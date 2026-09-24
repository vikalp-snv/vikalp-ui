import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { CloseButton } from "../../internal/CloseButton/CloseButton";
import { Alert, type AlertVariant } from "../Alert";
import "./Toast.css";

export type ToastVariant = AlertVariant;

export interface ToastOptions {
  title?: ReactNode;
  description?: ReactNode;
  /** Default "info". Error toasts are announced assertively (role="alert"). */
  variant?: ToastVariant;
  /** Milliseconds before auto-dismiss; Infinity keeps it until closed. */
  duration?: number;
}

interface ToastEntry extends ToastOptions {
  id: string;
}

export interface ToastContextValue {
  /** Shows a toast and returns its id. */
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast() must be used inside <ToastProvider>.");
  return context;
}

export interface ToastProviderProps {
  children?: ReactNode;
  /** Default auto-dismiss time for every toast, in ms. */
  duration?: number;
  /** Accessible name of the notification list. */
  label?: string;
}

/**
 * Holds the toast queue and renders it fixed to the bottom-right corner
 * (full width on phones). Timers pause while the pointer or focus is on a
 * toast, so nothing disappears while someone is reading or tabbing to it.
 */
export function ToastProvider({ children, duration = 5000, label = "Notifications" }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const nextId = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((options: ToastOptions) => {
    const id = `ui-toast-${++nextId.current}`;
    setToasts((current) => [...current, { ...options, id }]);
    return id;
  }, []);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Always mounted: a live region must exist before content is added to it */}
      <ol
        className="ui-toast-viewport"
        aria-label={label}
        aria-live="polite"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
        }}
      >
        {toasts.map((entry) => (
          <ToastItem
            key={entry.id}
            entry={entry}
            duration={entry.duration ?? duration}
            paused={hovered || focused}
            dismiss={dismiss}
          />
        ))}
      </ol>
    </ToastContext.Provider>
  );
}

function ToastItem({
  entry,
  duration,
  paused,
  dismiss,
}: {
  entry: ToastEntry;
  duration: number;
  paused: boolean;
  dismiss: (id: string) => void;
}) {
  const { id, title, description, variant = "info" } = entry;

  // ponytail: a pause restarts the full duration rather than resuming the
  // remainder; track elapsed time if that ever feels too long.
  useEffect(() => {
    if (paused || !Number.isFinite(duration)) return;
    const timer = setTimeout(() => dismiss(id), duration);
    return () => clearTimeout(timer);
  }, [paused, duration, id, dismiss]);

  return (
    <li className="ui-toast">
      <Alert variant={variant} title={title} role={variant === "error" ? "alert" : undefined}>
        {description}
      </Alert>
      <CloseButton label="Dismiss notification" className="ui-toast-close" onClick={() => dismiss(id)} />
    </li>
  );
}

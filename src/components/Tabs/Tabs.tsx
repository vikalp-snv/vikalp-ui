import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
} from "react";

import { cx } from "../../utils/cx";
import "./Tabs.css";

interface TriggerInfo {
  id?: string;
  disabled: boolean;
}

interface TabsContextValue {
  /** The selected value actually shown (see the fallback in Tabs). */
  value: string;
  select: (value: string) => void;
  /** Rendered ids: the consumer's `id` when given, else generated. */
  triggerId: (value: string) => string;
  panelId: (value: string) => string;
  registerTrigger: (value: string, info: TriggerInfo) => void;
  unregisterTrigger: (value: string) => void;
  setPanelId: (value: string, id: string | undefined) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs(component: string) {
  const context = useContext(TabsContext);
  if (!context) throw new Error(`<${component}> must be used inside <Tabs>.`);
  return context;
}

/** Either controlled (`value`) or uncontrolled (`defaultValue`); one is required so a tab is always reachable. */
type TabsValueProps =
  | { value: string; defaultValue?: never }
  | { value?: never; defaultValue: string };

export type TabsProps = Omit<HTMLAttributes<HTMLDivElement>, "defaultValue"> &
  TabsValueProps & {
    onValueChange?: (value: string) => void;
  };

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { value, defaultValue, onValueChange, className, ...props },
  ref,
) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? "");
  const requested = value ?? uncontrolled;
  const baseId = useId();

  // Triggers register in mount (= DOM) order; Map.set on an existing key keeps its place
  const [triggers, setTriggers] = useState(() => new Map<string, TriggerInfo>());
  const [panelIds, setPanelIds] = useState(() => new Map<string, string>());

  // Keyboard users need one reachable tab. If the requested value names no
  // enabled tab, show the first enabled one instead (onValueChange is not called).
  const enabled = [...triggers].filter(([, t]) => !t.disabled).map(([v]) => v);
  const current =
    triggers.size === 0 || enabled.includes(requested) ? requested : (enabled[0] ?? requested);

  const registerTrigger = useCallback((v: string, info: TriggerInfo) => {
    setTriggers((prev) => {
      const old = prev.get(v);
      if (old && old.id === info.id && old.disabled === info.disabled) return prev;
      return new Map(prev).set(v, info);
    });
  }, []);
  const unregisterTrigger = useCallback((v: string) => {
    setTriggers((prev) => {
      if (!prev.has(v)) return prev;
      const next = new Map(prev);
      next.delete(v);
      return next;
    });
  }, []);
  const setPanelId = useCallback((v: string, id: string | undefined) => {
    setPanelIds((prev) => {
      if (prev.get(v) === id) return prev;
      const next = new Map(prev);
      if (id === undefined) next.delete(v);
      else next.set(v, id);
      return next;
    });
  }, []);

  // Whitespace would split an IDREF list, so it cannot appear in an id
  const generatedId = (part: string, v: string) => `${baseId}-${part}-${v.replace(/\s/g, "-")}`;

  const context: TabsContextValue = {
    value: current,
    select(next) {
      if (value === undefined) setUncontrolled(next);
      if (next !== requested) onValueChange?.(next);
    },
    triggerId: (v) => triggers.get(v)?.id ?? generatedId("trigger", v),
    panelId: (v) => panelIds.get(v) ?? generatedId("panel", v),
    registerTrigger,
    unregisterTrigger,
    setPanelId,
  };

  return (
    <TabsContext.Provider value={context}>
      <div {...props} ref={ref} className={cx("ui-tabs", className)} />
    </TabsContext.Provider>
  );
});

export type TabsListProps = HTMLAttributes<HTMLDivElement>;

const keyTargets: Record<string, (i: number, n: number) => number> = {
  ArrowRight: (i, n) => (i + 1) % n,
  ArrowLeft: (i, n) => (i - 1 + n) % n,
  Home: () => 0,
  End: (_, n) => n - 1,
};

/**
 * role="tablist". Only the active tab is in the Tab order; arrow keys, Home
 * and End move between enabled tabs and activate them (automatic activation).
 */
export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(function TabsList(
  { className, onKeyDown, ...props },
  ref,
) {
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);
    const target = keyTargets[event.key];
    if (!target || event.defaultPrevented) return;
    const list = event.currentTarget;
    const tabs = Array.from(
      list.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)'),
    ).filter((tab) => tab.closest('[role="tablist"]') === list); // skip nested tab sets
    const index = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    event.preventDefault();
    const next = tabs[target(index, tabs.length)];
    next.focus();
    next.click();
  }

  return (
    <div
      {...props}
      ref={ref}
      role="tablist"
      className={cx("ui-tabs-list", className)}
      onKeyDown={handleKeyDown}
    />
  );
});

export interface TabsTriggerProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  value: string;
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  function TabsTrigger({ value, id, disabled = false, className, onClick, ...props }, ref) {
    const tabs = useTabs("TabsTrigger");
    const { registerTrigger, unregisterTrigger } = tabs;
    useEffect(() => registerTrigger(value, { id, disabled }), [value, id, disabled, registerTrigger]);
    useEffect(() => () => unregisterTrigger(value), [value, unregisterTrigger]);
    const selected = tabs.value === value;
    return (
      <button
        type="button"
        {...props}
        ref={ref}
        disabled={disabled}
        role="tab"
        id={id ?? tabs.triggerId(value)}
        aria-selected={selected}
        aria-controls={tabs.panelId(value)}
        tabIndex={selected ? 0 : -1}
        className={cx("ui-tabs-trigger", className)}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) tabs.select(value);
        }}
      />
    );
  },
);

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

/** role="tabpanel", labelled by its tab. Inactive panels stay mounted but hidden. */
export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  function TabsContent({ value, id, className, ...props }, ref) {
    const tabs = useTabs("TabsContent");
    const { setPanelId } = tabs;
    useEffect(() => {
      setPanelId(value, id);
      return () => setPanelId(value, undefined);
    }, [value, id, setPanelId]);
    return (
      <div
        tabIndex={0}
        {...props}
        ref={ref}
        role="tabpanel"
        id={id ?? tabs.panelId(value)}
        aria-labelledby={tabs.triggerId(value)}
        hidden={tabs.value !== value}
        className={cx("ui-tabs-content", className)}
      />
    );
  },
);

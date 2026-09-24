import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
} from "react";

import { cx } from "../../utils/cx";
import "./Tabs.css";

interface TabsContextValue {
  value: string;
  select: (value: string) => void;
  idFor: (part: "trigger" | "panel", value: string) => string;
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
  const current = value ?? uncontrolled;
  const baseId = useId();

  const context: TabsContextValue = {
    value: current,
    select(next) {
      if (value === undefined) setUncontrolled(next);
      if (next !== current) onValueChange?.(next);
    },
    // Whitespace would split an IDREF list, so it cannot appear in an id
    idFor: (part, v) => `${baseId}-${part}-${v.replace(/\s/g, "-")}`,
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
  function TabsTrigger({ value, className, onClick, ...props }, ref) {
    const tabs = useTabs("TabsTrigger");
    const selected = tabs.value === value;
    return (
      <button
        type="button"
        {...props}
        ref={ref}
        role="tab"
        id={tabs.idFor("trigger", value)}
        aria-selected={selected}
        aria-controls={tabs.idFor("panel", value)}
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
  function TabsContent({ value, className, ...props }, ref) {
    const tabs = useTabs("TabsContent");
    return (
      <div
        tabIndex={0}
        {...props}
        ref={ref}
        role="tabpanel"
        id={tabs.idFor("panel", value)}
        aria-labelledby={tabs.idFor("trigger", value)}
        hidden={tabs.value !== value}
        className={cx("ui-tabs-content", className)}
      />
    );
  },
);

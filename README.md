# @vikalpshakya/ui

Simnovus React component library (POC). It is built on semantic design tokens,
so the same components work in light and dark themes, in React apps and in
Astro pages (see [Using with Astro](#using-with-astro)).

## Install and use

```bash
npm install @vikalpshakya/ui
```

Load the stylesheet once near the app root, then import components:

```tsx
import "@vikalpshakya/ui/styles.css";
import { Button, Stack, Text } from "@vikalpshakya/ui";

export function SaveAction() {
  return (
    <Stack gap={2}>
      <Text tone="muted">Unsaved changes</Text>
      <Button>Save</Button>
    </Stack>
  );
}
```

React 18 and 19 are supported. They are peer dependencies, so the app provides React.

## Components

Each component accepts its native element's props (including `className`) and
forwards `ref` to that element. Exceptions are noted in the last column.

| Group | Component | Key props | Renders |
|---|---|---|---|
| Actions | `Button` | `variant` primary · secondary · outline · ghost · destructive; `size` sm · md · lg · icon; `loading`; `href` | `<button>`, or `<a>` with `href` |
| Typography | `Text` | `as` p · span · div · strong · em · small; `size` xs–lg; `weight`; `tone` default · muted · error; `align`; `truncate`; `mono` | `<p>` by default |
| | `Heading` | `level` 1–6 (required); `size` md–4xl to decouple looks from level | `<h1>`–`<h6>` |
| | `Link` | anchor props; `rel="noopener noreferrer"` added for `target="_blank"` | `<a>` |
| Layout | `Stack` | `direction` vertical · horizontal; `gap` (default 2); `align`; `justify`; `as` | `<div>` |
| | `Flex` | `direction`; `align`; `justify`; `wrap`; `gap`; `as` | `<div>` |
| | `Grid` | `columns` 1–12, or `minColumnWidth` for responsive auto-fill; `gap`; `align`; `as` | `<div>` |
| | `Container` | `size` sm 768 · md 1024 · lg 1280 · full; `as` | `<div>` |
| | `Divider` | `orientation` horizontal · vertical | `<hr>` |
| Forms | `Input` | states via `disabled` and `aria-invalid` | `<input>` |
| | `Textarea` | same states as Input; resizes vertically | `<textarea>` |
| | `Select` | `options` or `<option>` children; same states as Input | `<select>` |
| | `Checkbox` | `label`; `indeterminate` | `<input type="checkbox">`, inside a `<label>` when `label` is set |
| | `Radio` | `label`; group radios by `name` | `<input type="radio">`, inside a `<label>` when `label` is set |
| | `Switch` | `label` | `<input type="checkbox" role="switch">`, inside a `<label>` when `label` is set |
| Feedback | `Alert` | `variant` info · success · warning · error; `title`; `icon` (null hides it) | `<div>` |
| | `Spinner` | `size` sm · md · lg; `label` (default "Loading", "" makes it decorative) | `<span role="status">` |
| | `Progress` | `value`, `max`; no `value` = indeterminate | `<progress>` |
| | `Skeleton` | `width`, `height`; `shape` rect · circle | `<span aria-hidden>` |
| | `EmptyState` | `title`; `description`; `icon`; `action` | `<div>` |
| Display | `Card` | `interactive` (hover/focus lift) | `<div>` |
| | `Badge` | `variant` primary · solid · neutral · success · warning · error · info | `<span>` |
| | `Avatar` | `src`; `alt` (required); `fallback` (default: initials of `alt`); `size` sm · md · lg | `<span>` with an `<img>` or the fallback |
| | `List` | `ordered`; `variant` default · plain · divided; children are `<li>` | `<ul>` / `<ol>` |
| | `Table` | `density` default · compact; `hoverable`; children are native table markup | `<table>` in a horizontally scrolling `<div>` |

### Interactive components

```tsx
// Dialog: controlled, built on the native <dialog> + showModal()
<Dialog open={open} onOpenChange={setOpen} size="sm">
  <DialogHeader>
    <DialogTitle>Delete test run?</DialogTitle>
    <DialogDescription>This can't be undone.</DialogDescription>
  </DialogHeader>
  <DialogFooter>
    <DialogClose>Cancel</DialogClose>
    <DialogClose variant="destructive" onClick={remove}>Delete</DialogClose>
  </DialogFooter>
</Dialog>

// Dropdown: menu button; items close the menu unless onClick calls preventDefault()
<Dropdown>
  <DropdownTrigger>Options</DropdownTrigger>
  <DropdownMenu align="start">
    <DropdownItem onClick={openProfile}>Profile</DropdownItem>
    <DropdownItem checked={auto} onClick={toggleAuto}>Auto-refresh</DropdownItem>
    <DropdownItem disabled>Disabled</DropdownItem>
  </DropdownMenu>
</Dropdown>

// Tabs: `value` + `onValueChange` (controlled) or `defaultValue`
<Tabs defaultValue="overview">
  <TabsList aria-label="Test run">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="logs" disabled>Logs</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">…</TabsContent>
  <TabsContent value="logs">…</TabsContent>
</Tabs>

// Tooltip: wraps one focusable element; placement top · bottom · left · right
<Tooltip content="Run the test" placement="top">
  <Button>Run</Button>
</Tooltip>

// Toast: wrap the app once, then call toast() anywhere below it
<ToastProvider duration={5000}>
  <App />
</ToastProvider>

const { toast, dismiss } = useToast();
const id = toast({ title: "Test completed", description: "…", variant: "success" });
```

| Component | Behaviour |
|---|---|
| `Dialog` | `DialogClose` is `type="button"` by default, so a Cancel inside a form doesn't submit it. The browser supplies the backdrop, stacking above everything, the focus trap and focus return. Escape, a backdrop click, × or `DialogClose` call `onOpenChange(false)`. Page scroll is locked while it's open. `size` sm · md · lg. |
| `Dropdown` | `DropdownTrigger` is `type="button"` by default, so it never submits an enclosing form. Follows the WAI-ARIA menu-button pattern. Enter, Space and ↓ open the menu on the first item; ↑ opens it on the last. ↑/↓ wrap, Home/End jump, and Escape closes and returns focus to the trigger. Tab, a click outside, or moving focus away closes it. Disabled items stay focusable but do nothing. `checked` turns an item into a `menuitemcheckbox`. |
| `Tabs` | The standard tabs pattern: only the active tab is in the Tab order. ←/→ wrap and Home/End jump, skipping disabled tabs, and move the selection with them. Inactive panels stay mounted but hidden. If `value` names no enabled tab, the first enabled tab is shown so the tab list stays reachable by keyboard (`onValueChange` is not called for this). |
| `Tooltip` | Shows on hover after 300ms and immediately on keyboard focus. Hides on leave, blur or Escape. The pointer can move onto the tooltip without it closing. It is linked with `aria-describedby`. `disabled` renders just the child. |
| `Toast` | Toasts stack bottom-right, or full width on phones. They dismiss themselves after `duration` (`Infinity` keeps a toast until closed) and pause while hovered or focused. Each has a × button. The list is a polite live region, and error toasts use `role="alert"`. Variants: success · info · warning · error. |

The props' finite unions are exported as types, named `<Component><Prop>`:
`ButtonVariant`, `TextTone`, `HeadingLevel`, `AlertVariant` and so on.
`Space` is the type of every `gap` prop: a multiple of the 6px unit
(`gap={2}` is 12px).

Layout props (`gap`, `align`, and so on) become inline styles, and only when
they are passed. Leave a prop out if you'd rather set that property with a
`className`.

Accessibility notes:
- `Input`, `Textarea`, `Select` and `Progress` have no built-in label. Use a
  `<label htmlFor>`, `aria-label` or `aria-labelledby`.
- Checkbox, Radio and Switch are real inputs, so keyboard, form submission and
  screen-reader state are native. Their `label` prop wraps them in a `<label>`.
  Put related radios in a `<fieldset>` with a `<legend>`.
- `Alert` has no live-region role by default, so static alerts aren't announced
  on page load. Pass `role="alert"` (urgent) or `role="status"` (polite) for an
  alert that appears after something happens.
- `Skeleton` is hidden from screen readers. Mark the loading region with
  `aria-busy="true"`.
- An icon-only `Button` needs an `aria-label`.
- A link `Button` cannot be natively disabled; use `aria-disabled="true"` to
  get the disabled style. A `Link` with no `href` renders as an inactive
  placeholder.
- `Text` offers only the tones that pass WCAG AA contrast. On this palette,
  primary, success, warning and info fail as text on light surfaces.
- Known contrast exceptions come from the agreed token pairs, pending a design
  decision: the tinted `primary` Badge (2.6:1), white on `success` (3.1:1) and
  `info` (4.1:1) Badges, `error` Text on the page background (4.1–4.3:1), and
  the `destructive` Button (3.5–3.7:1), which mirrors the website's
  `bg-destructive/10 text-destructive` button.

## Using with Tailwind

Import the library stylesheet **after** Tailwind's CSS:

```tsx
import "./index.css";               // @tailwind base; @tailwind components; @tailwind utilities;
import "@vikalpshakya/ui/styles.css";
```

- The library's rules are plain class selectors, not cascade layers. Tailwind
  v3 base styles (and plugins such as `flowbite/plugin` or
  `@tailwindcss/forms`, which restyle `[type="checkbox"]`, `[type="radio"]`
  and `select`) otherwise override the components. Checkbox, Radio, Switch and
  Select are hardened against those plugins' rules as long as the library CSS
  loads after them.
- Tailwind utility classes passed in `className` can't reliably override a
  property the library sets. In Tailwind v4 they never can: utilities live in
  a cascade layer, and the library's unlayered rules always beat layered ones.
  In Tailwind v3 it depends on stylesheet order. Use a component prop, the
  `style` prop, or your own more specific selector instead. Properties the
  library doesn't set (margins, `max-width`, and so on) are fine as utilities.

## Using with Astro

Static components (Button, Card, Text, layout, form fields, Alert, Table, and
so on) render to plain HTML in `.astro` files with no hydration and no
JavaScript.

Interactive components need a React `client:*` directive to work:
`Dialog`, `Dropdown`, `Tabs`, `Tooltip` and `Toast`, plus Avatar's image
fallback and Checkbox's `indeterminate`. Without one they render their initial
HTML but don't respond.

Each hydrated component is its own React root (an Astro island), so context
doesn't cross islands. `ToastProvider` and every component calling
`useToast()` must live inside the same island:

```astro
<AppShell client:load />  <!-- ToastProvider and its useToast() callers inside -->
```

## Known limitations

- A `Dropdown` inside a `Table` gets clipped: the table's horizontal-scroll
  wrapper cuts the menu off. Place row-action menus outside the scrolling
  table until menus render in the browser's top layer.

## Theming

Light is the default. To switch to dark, add the `dark` class to an ancestor,
usually `<html>`. This is the same convention the Simnovus website uses:

```ts
document.documentElement.classList.toggle("dark", isDark);
```

## Design tokens

Components never hardcode values. They read CSS variables, and the variables are
namespaced `--ui-*` so they don't collide with the app's own variables:

```text
component CSS → semantic token (--ui-primary) → theme (:root | .dark) → value (#F16E22)
```

| File | Contains |
|---|---|
| `src/styles/theme.css` | Semantic colors in light and dark: `--ui-primary`, `--ui-background`, `--ui-foreground`, `--ui-card`, `--ui-popover`, `--ui-muted`, `--ui-secondary`, `--ui-accent`, `--ui-border`, `--ui-input`, `--ui-ring`, plus each one's `-foreground`. Status colors: `--ui-success`, `--ui-warning`, `--ui-error`, `--ui-destructive`, `--ui-info`. |
| `src/styles/base.css` | Two rules that aren't tokens: `[hidden]` still hides library components, and the shared `ui-spin` keyframes. |
| `src/styles/tokens.css` | Theme-independent tokens. Spacing: `--ui-spacing: 6px`. Radius: `--ui-radius` plus `-sm` … `-4xl` and `-full`. Typography: `--ui-font-family-sans` (Fira Sans) and `--ui-font-family-mono` (Ubuntu Mono), sizes `xs`–`4xl`, weights, and `--ui-line-height-tight` / `-normal`. Also control heights, motion, and shadows. |

The color role names match the website's `global.css` (`--primary` ↔ `--ui-primary`).

- **Spacing** is one 6px unit. Components write `calc(var(--ui-spacing) * N)`,
  where `N` is the Tailwind step the design uses (`px-3` → 3).
- **Fonts** are referenced but never downloaded. The app loads Fira Sans and
  Ubuntu Mono; otherwise the browser uses the `sans-serif` and `monospace`
  fallbacks.

To override a token, redefine it after importing the stylesheet:

```css
:root {
  --ui-font-family-sans: var(--font-sans); /* e.g. Astro's self-hosted face */
}
```

The stylesheet defines `--ui-*` variables and `.ui-*` classes. It has no resets
and no `body`, heading or bare element selectors, so importing it doesn't
restyle the rest of the app. Two rules reach outside a component: elements with
a `ui-` class and the `hidden` attribute stay hidden, and page scrolling is
locked while a `Dialog` is open.

## Conventions for new components

```text
src/components/Name/
  Name.tsx    forwardRef component; props extend the native element's attributes
  Name.css    .ui-name and .ui-name-<modifier>; reads --ui-* tokens only
  index.ts    exports the component and its types
```

- Add `export * from "./Name"` to `src/components/index.ts`. The component's own
  `index.ts` decides what is public, and nothing else is.
- Pick the native element first (`<progress>`, `<select>`, `<input type="checkbox">`).
  Add ARIA only where HTML has no equivalent.
- Size things with `calc(var(--ui-spacing) * N)`. `gap` props take the `Space` type.
- Code shared by several components that isn't public goes in `src/internal/`.
- For interactive components, build on native behaviour first (`<dialog>`,
  real buttons), then add the WAI-ARIA pattern's keyboard handling. Floating
  UI stacks with `--ui-z-overlay` and `--ui-z-toast`.
- Use finite unions for `variant` and `size`, and add them only where the
  component actually has variants.
- Use `cx()` from `src/utils/cx.ts` to compose class names.
- Take states from the platform (`:disabled`, `:focus-visible`, `aria-invalid`)
  instead of adding extra boolean props.
- For focus, use `outline: 2px solid transparent` together with
  `box-shadow: var(--ui-focus-ring)`. The transparent outline keeps focus
  visible in forced-colors (high contrast) mode.
- Don't write theme-specific component rules (`.dark .ui-x`). Add or reuse a
  semantic token instead. The destructive Button tint is the one documented
  exception; it mirrors the website's `dark:bg-destructive/20`.

## Development

```bash
npm install
npm run typecheck
npm run build          # dist/index.js, index.cjs, styles.css, *.d.ts
npm pack --dry-run     # inspect the package contents without publishing
```

To try changes in a local app, run `npm install ../vikalp-ui`. A symlinked
(`file:`) install also needs `resolve: { dedupe: ["react", "react-dom"] }` in
the app's Vite config.

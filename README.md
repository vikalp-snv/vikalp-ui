# @vikalpshakya/ui

Simnovus React component library (POC). It is built on semantic design tokens,
so the same components work in light and dark themes, in React apps, and in
Astro pages (as static HTML, with no hydration).

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

The props' unions are exported as types, named `<Component><Prop>`:
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

The stylesheet defines only `--ui-*` variables and `.ui-*` classes. It has no
resets and no `body`, heading, or bare element selectors, so importing it
doesn't change the rest of the app.

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

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
import { Badge, Button, Card, Input } from "@vikalpshakya/ui";

export function SaveAction() {
  return <Button variant="primary">Save</Button>;
}
```

React 18 and 19 are supported. They are peer dependencies, so the app provides React.

## Components

Each component accepts its native element's props (including `className`) and
forwards `ref` to that element.

| Component | Props | Renders |
|---|---|---|
| `Button` | `variant`: primary · secondary · outline · ghost · destructive; `size`: sm · md · lg · icon; `loading`; `href` | `<button>`, or `<a>` when `href` is set |
| `Badge` | `variant`: primary · solid · neutral · success · warning · error · info | `<span>` |
| `Card` | `interactive` (hover/focus lift) | `<div>` |
| `Input` | states via `disabled` and `aria-invalid` | `<input>` |

The variant and size unions are exported as types: `ButtonVariant`, `ButtonSize`,
and `BadgeVariant`.

Accessibility notes:
- `Input` has no built-in label. Wrap it in a `<label>` or give it `aria-label`.
- An icon-only `Button` needs an `aria-label`.
- A link `Button` cannot be natively disabled. Use `aria-disabled="true"` to
  get the disabled style.

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
| `src/styles/tokens.css` | Theme-independent tokens. Spacing: `--ui-spacing: 6px`. Radius: `--ui-radius` plus `-sm` … `-4xl` and `-full`. Typography: `--ui-font-family-sans` (Fira Sans) and `--ui-font-family-mono` (Ubuntu Mono), sizes, and weights. Also control heights, motion, and shadows. |

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

- Re-export new components from `src/components/index.ts` and `src/index.ts`.
  Nothing else is public.
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

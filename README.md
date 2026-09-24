# @vikalp/ui

A reusable React component library built with TypeScript and Vite.

## How the library is organized

```text
src/
  index.ts                    Public package entry point
  styles/tokens.css           Shared design decisions
  components/
    index.ts                  Public component barrel
    Button/
      Button.tsx              Component behavior and API
      Button.css              Component styles
      index.ts                Button's public exports
```

- `package.json` defines the package name, public files, entry points, scripts,
  peer dependencies, and development tools.
- `package-lock.json` locks exact dependency versions so installs are repeatable.
- `tsconfig.json` controls strict TypeScript checking and React JSX compilation.
- `vite.config.ts` builds ESM and CommonJS JavaScript, extracts CSS, keeps React
  outside the bundle, and generates TypeScript declarations.
- `src/index.ts` is the only public entrance to the library. Export something
  here, directly or through a barrel, before consumers can import it.
- `tokens.css` stores reusable design values. Components should consume these
  variables instead of repeating raw colors, spacing, and typography values.

## Design tokens and theming

The package ships namespaced Simnovus tokens for core colors, semantic states,
typography, a 6px spacing scale, control heights, radii, focus, and shadows.
Namespacing them as `--ui-*` prevents collisions with consuming applications.

Light mode is the default. Add `dark` to an ancestor, commonly the root HTML
element, to activate the dark palette for every nested library component:

```tsx
document.documentElement.classList.toggle("dark", isDarkMode);
```

The library references Fira Sans and Ubuntu Mono but does not download fonts.
The consuming application should load those font files or web-font imports;
otherwise the browser uses the declared generic fallbacks.

Applications may override tokens after importing the package stylesheet:

```css
:root {
  --ui-radius-md: 6px;
}
```

## Why React is listed twice

React is a `peerDependency` because the consuming application must provide it.
Bundling a second React copy can break hooks and increases bundle size. React is
also a `devDependency` so this repository can compile and type-check components.

## Development workflow

Install dependencies once:

```bash
npm install
```

Check TypeScript while developing:

```bash
npm run typecheck
```

Build the publishable package:

```bash
npm run build
```

The build creates `dist/index.js`, `dist/index.cjs`, `dist/styles.css`, and
declaration files. Inspect what npm would publish without publishing it:

```bash
npm pack --dry-run
```

## Using the library locally

From another React project's directory, install this repository by path:

```bash
npm install ../vikalp-ui
```

Load the library styles once near that application's root:

```tsx
import "@vikalp/ui/styles.css";
```

Then use components normally:

```tsx
import { Button } from "@vikalp/ui";

export function SaveAction() {
  return <Button variant="primary">Save</Button>;
}
```

After changing this library, rebuild it. Reinstall the local package in the
consumer if its package manager does not refresh path dependencies automatically.

## Adding a component

For a new `Input` component:

1. Create `src/components/Input/Input.tsx` and define `InputProps` from the
   matching native HTML attributes where possible.
2. Create `src/components/Input/Input.css`. Use `--ui-*` tokens for shared
   visual decisions and a unique `.ui-input` class prefix.
3. Create `src/components/Input/index.ts` and export both the component and its
   prop type.
4. Re-export them from `src/components/index.ts`.
5. Run `npm run build` and verify the declarations in `dist` are generated.
6. Exercise the component in a real consumer before publishing it.

Keep component APIs small. Prefer native HTML props, semantic elements, visible
focus states, keyboard support, and explicit variants over one-off style props.

## Recommended next steps

Add these in this order as the library grows:

1. **Storybook** for isolated component examples, states, and documentation.
2. **Vitest and Testing Library** for interaction and accessibility behavior.
3. **ESLint and Prettier** once more contributors need automated conventions.
4. **Changesets** for versioning and changelogs across releases.
5. **CI** to run type checking, tests, build, and `npm pack --dry-run` on pull
   requests.

Before the first public release, confirm the npm scope is available, authenticate
with `npm login`, and publish a public scoped package with:

```bash
npm publish --access public
```

Use semantic versions: patch for fixes, minor for backward-compatible features,
and major for breaking API changes.
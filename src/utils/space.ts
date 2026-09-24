/**
 * A multiple of the 6px --ui-spacing unit, using Tailwind's step numbers
 * (gap={2} → 12px). The only spacing scale; there is no second system.
 */
export type Space = 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 4 | 5 | 6 | 8 | 10 | 12;

export function space(step: Space) {
  return `calc(var(--ui-spacing) * ${step})`;
}

/** Semantic elements a layout primitive may render as. */
export type LayoutElement =
  | "div"
  | "section"
  | "article"
  | "aside"
  | "header"
  | "footer"
  | "main"
  | "nav"
  | "ul"
  | "ol";

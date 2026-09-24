/** Joins the truthy class names: cx("a", cond && "b", className). */
export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

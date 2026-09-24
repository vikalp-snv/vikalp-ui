import { forwardRef, type TableHTMLAttributes } from "react";

import { cx } from "../../utils/cx";
import "./Table.css";

export type TableDensity = "default" | "compact";

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  density?: TableDensity;
  /** Highlights the row under the pointer; useful for wide, scanned tables. */
  hoverable?: boolean;
}

/**
 * Native <table>; write <caption>/<thead>/<tbody>/<tr>/<th>/<td> as usual.
 * A wrapper <div> scrolls horizontally on narrow screens; props, ref and
 * className go to the <table>. Sorting, selection etc. belong to DataTable.
 */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { density = "default", hoverable = false, className, ...props },
  ref,
) {
  return (
    <div className="ui-table-wrapper">
      <table
        {...props}
        ref={ref}
        className={cx(
          "ui-table",
          `ui-table-${density}`,
          hoverable && "ui-table-hoverable",
          className,
        )}
      />
    </div>
  );
});

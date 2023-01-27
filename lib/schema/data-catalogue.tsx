import { numFormat, toDate } from "@lib/helpers";

type XYColumn = {
  x_en: string;
  x_bm: string;
  y_en: string;
  y_bm: string;
};

type XYRow = {
  x: string | number;
  y: string | number;
};

type Period = "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";

/**
 * For timeseries & choropleth.
 * @param {XYColumn} column Column
 * @param {"en"|"bm"}locale en | bm
 * @param {Period} period Period
 * @returns table schema
 */
export const CATALOGUE_TABLE_SCHEMA = (
  column: XYColumn,
  locale: "en" | "bm" = "en",
  period: Period
) => {
  const formatBy = {
    DAILY: "dd MMM yyyy",
    WEEKLY: "dd MMM yyyy",
    MONTHLY: "MMM yyyy",
    QUARTERLY: "qQ yyyy",
    YEARLY: "yyyy",
  };
  return [
    {
      id: "x",
      header: locale === "en" ? column.x_en : column.x_bm,
      accessorKey: "x",
      sortDescFirst: true,
      cell: (item: any) => {
        const x: number | string = item.getValue();
        return (
          <div>
            <span className="text-sm">
              {typeof x === "number" ? toDate(x, formatBy[period], locale) : x}
            </span>
          </div>
        );
      },
    },
    {
      id: "y",
      header: locale === "en" ? column.y_en : column.y_bm,
      accessorFn: ({ y }: XYRow) => (typeof y === "number" ? numFormat(y, "standard") : y),
      sortDescFirst: true,
      sortingFn: "localeNumber", // ()typeof y === "number" ? "localeNumber" : "auto",
    },
  ];
};

export type UniversalColumn = {
  en: Record<string, string>;
  bm: Record<string, string>;
};

export const UNIVERSAL_TABLE_SCHEMA = (
  column: UniversalColumn,
  locale: "en" | "bm",
  keys: string[]
) => {
  const columns = Object.entries(column[locale]);
  const sorted = [
    ...columns.filter(([key, _]) => keys.includes(key)),
    ...columns.filter(([key, _]) => !keys.includes(key)),
  ];

  return sorted.map(([key, value]) => {
    return {
      id: key,
      header: value,
      accessorKey: key,
      className: "text-left",
    };
  });
};

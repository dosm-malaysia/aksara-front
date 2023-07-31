import { useTranslation } from "@hooks/useTranslation";
import { numFormat, toDate } from "@lib/helpers";

type XYColumn = {
  x_en: string;
  x_bm: string;
  y_en: string;
  y_bm: string;
  [y_lang: string]: string;
};

type Period = "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";

/**
 * For timeseries & choropleth.
 * @param {XYColumn} column Column
 * @param {en|bm}locale en | bm
 * @param {Period} period Period
 * @returns table schema
 */
export const CATALOGUE_TABLE_SCHEMA = (
  column: XYColumn,
  locale: "en" | "bm" = "en",
  period: Period,
  headers: string[],
  precision: number | [number, number]
) => {
  const formatBy = {
    DAILY: "dd MMM yyyy",
    WEEKLY: "dd MMM yyyy",
    MONTHLY: "MMM yyyy",
    QUARTERLY: "qQ yyyy",
    YEARLY: "yyyy",
  };
  const { t } = useTranslation();

  const parseX = (y: string) => {
    let result = undefined;
    result = locale === "en" ? column[`${y}_en`] : column[`${y}_bm`];
    if (result) return result;

    return locale === "en" ? column.y_en : column.y_bm;
  };

  const parseY = (item: any, y: string) => {
    let result = !item[y] ? item.y : item[y];

    return typeof result === "number" ? numFormat(item[y], "standard", precision) : result;
  };

  const y_headers = headers
    .filter((y: string) => !["line", "x"].includes(y))
    .map((y: string) => ({
      id: y,
      header: parseX(y),
      accessorFn: (item: any) => parseY(item, y),
      sortingFn: "localeNumber",
    }));

  return [
    {
      id: "x",
      header: locale === "en" ? column.x_en : column.x_bm,
      accessorKey: "x",
      cell: (item: any) => {
        const x: number | string = item.getValue();
        return (
          <div>
            <span className="text-sm">
              {
                {
                  number: toDate(x, formatBy[period], locale),
                  string: !t(`catalogue.show_filters.${x}`).includes(".show_filters")
                    ? t(`catalogue.show_filters.${x}`)
                    : x,
                }[typeof x as number | string]
              }
            </span>
          </div>
        );
      },
    },
    ...y_headers,
  ];
};

export type UniversalColumn = {
  en: Record<string, string>;
  bm: Record<string, string>;
};

/**
 *
 * @param {UniversalColumn} column
 * @param locale en | bm
 * @param keys
 * @returns Table schema
 */
export const UNIVERSAL_TABLE_SCHEMA = (
  column: UniversalColumn,
  locale: "en" | "bm",
  keys: string[]
) => {
  const columns = Object.entries(column[locale]);
  const [index_cols, rest]: [[string, string][], [string, string][]] = [[], []];

  columns.forEach(([key, value]: [string, string]) => {
    if (keys.includes(key)) index_cols.push([key, value]);
    else rest.push([key, value]);
  });

  return [...index_cols, ...rest].map(([key, value]) => {
    return {
      id: key,
      header: value,
      // accessorKey: key,
      // Filter bug, cannot have number type in table: https://github.com/TanStack/table/issues/4280
      accessorFn: (item: any) => {
        if (typeof item[key] === "string") return item[key];
        if (typeof item[key] === "number") return item[key].toString();
        return "";
      },
      className: "text-left",
    };
  });
};

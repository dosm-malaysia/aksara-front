import { numFormat, toDate } from "@lib/helpers";

type Column = {
  x_en: string;
  x_bm: string;
  y_en: string;
  y_bm: string;
};

type Entry = {
  x: string | number;
  y: string | number;
};

export const CATALOGUE_TABLE_SCHEMA = (column: Column, locale: string = "en") => {
  return [
    {
      id: "x",
      header: locale === "en" ? column.x_en : column.x_bm,
      accessorKey: "x",
      cell: (item: any) => {
        const x: number | string = item.getValue();
        return (
          <div>
            <span className="text-sm">{typeof x === "number" ? toDate(x, locale) : x}</span>
          </div>
        );
      },
    },
    {
      id: "y",
      header: locale === "en" ? column.y_en : column.y_bm,
      accessorFn: ({ y }: Entry) => (typeof y === "number" ? numFormat(y, "standard") : y),
      sortingFn: "localeNumber", // ()typeof y === "number" ? "localeNumber" : "auto",
    },
  ];
};

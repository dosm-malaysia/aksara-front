import type { Page } from "@lib/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { SHORT_LANG } from "@lib/constants";
import { OptionType } from "@components/types";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";

import Metadata from "@components/Metadata";
import DataCatalogueShow from "@data-catalogue/show";
import { useMemo } from "react";

const CatalogueShow: Page = ({
  params,
  config,
  dataset,
  explanation,
  metadata,
  urls,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t, i18n } = useTranslation();
  const lang = SHORT_LANG[i18n.language as keyof typeof SHORT_LANG];

  const availableOptions = useMemo<OptionType[]>(() => {
    switch (dataset.type) {
      case "TABLE":
        return [{ label: t("catalogue.table"), value: "table" }];

      case "GEOJSON":
        return [{ label: t("catalogue.chart"), value: "chart" }];
      default:
        return [
          { label: t("catalogue.chart"), value: "chart" },
          { label: t("catalogue.table"), value: "table" },
        ];
    }
  }, [dataset.type]);

  return (
    <>
      <Metadata
        title={dataset.meta[lang].title}
        description={dataset.meta[lang].desc.replace(/^(.*?)]/, "")}
        keywords={""}
      />
      <DataCatalogueShow
        options={availableOptions}
        params={params}
        config={config}
        dataset={dataset}
        explanation={explanation}
        metadata={metadata}
        urls={urls}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale, query, params }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);

  const { data } = await get("/data-variable/", { id: params!.id, ...query });

  let filter_state;

  if (data.API.chart_type === "TIMESERIES") {
    filter_state = Object.fromEntries(
      data.API.filters.map((filter: any) => [
        filter.key,
        filter.options.find((item: OptionType) => item.value === query[filter.key]) ??
          filter.default,
      ])
    );
  }

  const { in_dataset: _, out_dataset: __, ...metadata } = data.metadata;

  return {
    props: {
      ...i18n,
      config: {
        filter_state: filter_state ?? {},
        filter_mapping: data.API.filters ?? null,
        ...data.API,
      },
      params: params,
      dataset: {
        type: data.API.chart_type,
        chart: data.chart_details.chart_data ?? {},
        table: data.chart_details.table_data ?? null,
        meta: data.chart_details.intro,
      },
      explanation: data.explanation,
      metadata: {
        ...metadata,
        definitions: [...(data.metadata?.in_dataset ?? []), ...data.metadata.out_dataset],
      },
      urls: data.downloads ?? {},
    },
  };
};

export default CatalogueShow;
/** ------------------------------------------------------------------------------------------------------------- */

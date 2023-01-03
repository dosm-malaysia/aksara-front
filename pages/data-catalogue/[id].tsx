import type { Page } from "@lib/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { SHORT_LANG } from "@lib/constants";
import { OptionType } from "@components/types";
import { useTranslation } from "next-i18next";
import { get } from "@lib/api";

import Metadata from "@components/Metadata";
import DataCatalogueShow from "@data-catalogue/show";

const CatalogueShow: Page = ({
  params,
  config,
  dataset,
  explanation,
  metadata,
  urls,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t, i18n } = useTranslation();
  const lang = SHORT_LANG[i18n.language] as "en" | "bm";

  return (
    <>
      <Metadata
        title={dataset.meta[lang].title}
        description={dataset.meta[lang].desc.replace(/^(.*?)]/, "")}
        keywords={""}
      />
      <DataCatalogueShow
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

  return {
    props: {
      ...i18n,
      config: {
        filter_state: filter_state ?? {},
        filter_mapping: data.API.filters ?? {},
        ...data.API,
      },
      params: params,
      dataset: {
        type: data.API.chart_type,
        chart: data.chart_details.chart_data ?? {},
        table: data.chart_details.table_data,
        meta: data.chart_details.intro,
      },
      explanation: data.explanation,
      metadata: data.metadata,
      urls: data.downloads,
    },
  };
};

export default CatalogueShow;
/** ------------------------------------------------------------------------------------------------------------- */

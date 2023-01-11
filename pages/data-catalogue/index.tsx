import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "next-i18next";
import { get } from "@lib/api";
import DataCatalogue from "@data-catalogue/index";
import { SHORT_LANG } from "@lib/constants";
import { sortAlpha } from "@lib/helpers";

const CatalogueIndex: Page = ({
  query,
  collection,
  total,
  sources,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation();

  return (
    <>
      <Metadata title={t("nav.catalogue")} description={""} keywords={""} />
      <DataCatalogue query={query} collection={collection} total={total} sources={sources} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale, query }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);

  const { data } = await get("/data-catalog/", { lang: SHORT_LANG[locale!], ...query });

  const collection = Object.entries(data.dataset)
    .sort((a: [string, any], b: [string, any]) => a[0].localeCompare(b[0]))
    .map(([category, subcollection]) => {
      return [
        category,
        Object.entries(subcollection as Record<string, any>).map(
          ([key, item]: [string, unknown]) => [
            key,
            sortAlpha(item as Array<Record<string, any>>, "catalog_name"),
          ]
        ),
      ];
    });

  return {
    props: {
      ...i18n,
      query: query ?? {},
      total: data.total_all,
      sources: data.source_filters.sort((a: string, b: string) => a.localeCompare(b)),
      collection,
    },
  };
};

export default CatalogueIndex;

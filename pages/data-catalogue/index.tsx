import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "next-i18next";
import { get } from "@lib/api";
import DataCatalogue from "@data-catalogue/index";
import { SHORT_LANG } from "@lib/constants";

const CatalogueIndex: Page = ({
  query,
  collection,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation();

  return (
    <>
      <Metadata title={t("nav.catalogue")} description={""} keywords={""} />
      <DataCatalogue query={query} collection={collection} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale, query }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);

  const { data } = await get("/data-catalog/", { lang: SHORT_LANG[locale!] });
  return {
    props: {
      ...i18n,
      query: query ?? {},
      collection: {
        health: data["COVID-19"],
      },
    },
  };
};

export default CatalogueIndex;

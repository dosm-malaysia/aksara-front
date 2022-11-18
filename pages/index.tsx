import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import DataCatalogue from "@data-catalogue/index";
import "react-medium-image-zoom/dist/styles.css";
import { get } from "@lib/api";
import { SHORT_LANG } from "@lib/constants";

const Home: Page = ({
  query,
  collection,
  total,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Metadata keywords={""} />
      <DataCatalogue query={query} collection={collection} total={total} />
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
      total: data.total_all,
      collection: Object.entries(data.dataset),
    },
  };
};

export default Home;

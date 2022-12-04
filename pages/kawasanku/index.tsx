import { InferGetStaticPropsType, GetStaticProps } from "next";
import { get } from "@lib/api";
import { Page, ReactElement } from "@lib/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import KawasankuDashboard from "@dashboards/kawasanku";
import Metadata from "@components/Metadata";
import { useTranslation } from "next-i18next";
import { StateDropdown, StateModal } from "@components/index";
import Layout from "@components/Layout";
import { routes } from "@lib/routes";
import { JSXElementConstructor } from "react";

const KawasankuIndex: Page = ({
  last_updated,
  timeseries_screenrate,
  heatmap_screenrate,
  bar_age,
  choropleth_malaysia_peka_b40,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();

  return (
    <>
      <Metadata
        title={t("nav.megamenu.dashboards.kawasanku")}
        description={t("peka.title_description")}
        keywords={""}
      />
      <KawasankuDashboard />
    </>
  );
};

KawasankuIndex.layout = (page: ReactElement<any, string | JSXElementConstructor<any>>) => (
  <Layout>{page}</Layout>
);

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);

  // disable page
  return {
    props: {
      ...i18n,
    },
  };
};

export default KawasankuIndex;

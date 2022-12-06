import { InferGetStaticPropsType, GetStaticProps } from "next";
import { Page } from "@lib/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import KawasankuDashboard from "@dashboards/kawasanku";
import Metadata from "@components/Metadata";
import { useTranslation } from "next-i18next";
import Layout from "@components/Layout";

const KawasankuState: Page = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
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

KawasankuState.layout = page => <Layout>{page}</Layout>;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);

  // disable page
  return {
    props: {
      ...i18n,
    },
  };
};

export default KawasankuState;

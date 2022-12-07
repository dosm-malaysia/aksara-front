import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Metadata from "@components/Metadata";
import { useTranslation } from "next-i18next";
import CrimeDashboard from "@dashboards/crime";
import { StateDropdown, StateModal } from "@components/index";
import Layout from "@components/Layout";
import { routes } from "@lib/routes";
import { useRouter } from "next/router";
import { ReactNode } from "react";

const Crime: Page = ({
  last_updated,
  timeseries,
  choropleth,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();

  return (
    <>
      <Metadata
        title={t("nav.megamenu.dashboards.crime")}
        description={t("crime.description")}
        keywords={""}
      />
      <CrimeDashboard last_updated={last_updated} timeseries={timeseries} choropleth={choropleth} />
    </>
  );
};

Crime.layout = (page: ReactNode) => (
  <Layout
    stateSelector={
      <StateDropdown
        url={routes.CRIME}
        currentState={(useRouter().query.state as string) ?? "mys"}
        exclude={["pjy", "lbn"]}
        hideOnScroll
      />
    }
  >
    <StateModal url={routes.CRIME} exclude={["kvy"]} />
    {page}
  </Layout>
);
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);

  const { data } = await get("/dashboard", { dashboard: "crime_dashboard" });

  return {
    props: {
      ...i18n,
      last_updated: new Date().valueOf(),
      timeseries: {
        data: data.timeseries.data.mys,
      },
      choropleth: data.choropleth_malaysia,
    },
  };
};

export default Crime;

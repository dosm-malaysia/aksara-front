/**
 * Covid Page <Index>
 */
import { Layout, Metadata, StateDropdown, StateModal } from "@components/index";
import CovidDashboard from "@dashboards/archived/covid";
import { get } from "@lib/api";
import { CountryAndStates } from "@lib/constants";
import { sortMsiaFirst } from "@lib/helpers";
import { routes } from "@lib/routes";
import { InferGetStaticPropsType, GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal } from "react";

const CovidIndex = ({
  last_updated,
  bar_chart,
  snapshot_bar,
  snapshot_graphic,
  snapshot_table,
  timeseries_admitted,
  timeseries_cases,
  timeseries_deaths,
  timeseries_icu,
  timeseries_tests,
  timeseries_vents,
  util_chart,
  statistics,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation("common");

  return (
    <>
      <Metadata
        title={t("nav.megamenu.dashboards.covid_19")}
        description={t("covid.title_description1")}
        keywords={""}
      />
      <CovidDashboard
        last_updated={last_updated}
        bar_chart={bar_chart}
        snapshot_bar={snapshot_bar}
        snapshot_graphic={snapshot_graphic}
        snapshot_table={snapshot_table}
        timeseries_admitted={timeseries_admitted}
        timeseries_cases={timeseries_cases}
        timeseries_deaths={timeseries_deaths}
        timeseries_icu={timeseries_icu}
        timeseries_tests={timeseries_tests}
        timeseries_vents={timeseries_vents}
        util_chart={util_chart}
        statistics={statistics}
      />
    </>
  );
};

CovidIndex.layout = (page: ReactElement<any, string | JSXElementConstructor<any>>) => (
  <Layout
    stateSelector={
      <StateDropdown url={routes.COVID} currentState={"mys"} exclude={["kvy"]} hideOnScroll />
    }
  >
    <StateModal url={routes.COVID} exclude={["kvy"]} />
    {page}
  </Layout>
);

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  // disable page
  return {
    notFound: true,
  };
  //   const i18n = await serverSideTranslations(locale!, ["common"]);
  //   const { data } = await get("/kkmnow", { dashboard: "covid_epid", state: "mys" }); // fetch static data here
  //   data.snapshot_table.data = sortMsiaFirst(data.snapshot_table.data, "state");

  //   return {
  //     props: {
  //       last_updated: new Date().valueOf(),
  //       bar_chart: data.bar_chart,
  //       snapshot_bar: data.snapshot_bar,
  //       snapshot_graphic: data.snapshot_graphic,
  //       snapshot_table: data.snapshot_table,
  //       timeseries_admitted: data.timeseries_admitted,
  //       timeseries_cases: data.timeseries_cases,
  //       timeseries_deaths: data.timeseries_deaths,
  //       timeseries_icu: data.timeseries_icu,
  //       timeseries_tests: data.timeseries_tests,
  //       timeseries_vents: data.timeseries_vents,
  //       util_chart: data.util_chart,
  //       statistics: data.statistics,
  //       ...i18n,
  //     },
  //     revalidate: 300,
  //   };
};

export default CovidIndex;

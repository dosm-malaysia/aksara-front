import type { Page } from "@lib/types";
import { InferGetStaticPropsType, GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import dynamic from "next/dynamic";
import { get } from "@lib/api";
import { useTranslation } from "next-i18next";

import Metadata from "@components/Metadata";
import Hero from "@components/Hero";
import Container from "@components/Container";
import Section from "@components/Section";
import { default as Tabs, Panel } from "@components/Tabs";
import Slider from "@components/Chart/Slider";
import { AKSARA_COLOR, BREAKPOINTS } from "@lib/constants";
import { numFormat, toDate } from "@lib/helpers";
import Card from "@components/Card";
import { EyeIcon, DocumentArrowDownIcon } from "@heroicons/react/24/solid";
import At from "@components/At";
import { ReactNode } from "react";
import { useSlice } from "@hooks/useSlice";
import { useData } from "@hooks/useData";
import { routes } from "@lib/routes";
import { useWindowWidth } from "@hooks/useWindowWidth";

const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

const Home: Page = ({
  timeseries,
  timeseries_callouts,
  analytics,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const LATEST_TIMESTAMP = timeseries.data.x[timeseries.data.x.length - 1];
  const windowWidth = useWindowWidth();
  const { t, i18n } = useTranslation();

  const { data, setData } = useData({
    minmax: [0, timeseries.data.x.length - 1],
  });
  const { coordinate } = useSlice(timeseries.data, data.minmax);

  const PANELS = [
    {
      name: t("home.section_1.today"),
      data: analytics,
    },
    {
      name: t("home.section_1.past_month"),
      data: analytics,
    },
    {
      name: t("home.section_1.all_time"),
      data: analytics,
    },
  ];

  return (
    <>
      <Metadata keywords={""} />

      <Hero
        background="home-banner"
        className="relative flex min-h-[300px] flex-col items-center justify-center text-left md:text-center"
      >
        <h3 className="mb-3">{t("home.title")}</h3>
        <p className="max-w-3xl text-dim">{t("home.description")}</p>
      </Hero>
      <Container className="min-h-screen">
        <Section title={t("home.section_1.title")} description={t("home.section_1.description")}>
          <Tabs>
            {PANELS.map(panel => (
              <Panel name={panel.name} key={panel.name}>
                <div className="grid grid-cols-2 gap-6 py-6 lg:grid-cols-4">
                  <Card className="flex h-full flex-col justify-between space-y-3">
                    <h4 className="flex gap-3 text-base">{t("home.section_1.dashboards")}</h4>
                    <h3 className="font-medium">13</h3>
                  </Card>
                  <Card className="flex h-full flex-col justify-between space-y-3">
                    <h4 className="flex gap-3 text-base">
                      {t("home.section_1.datasets_available")}
                    </h4>
                    <h3 className="font-medium">56</h3>
                  </Card>
                  <Card className="flex h-full flex-col justify-between space-y-3">
                    <h4 className="flex gap-3 text-base">{t("home.section_1.resource_views")}</h4>
                    <h3 className="font-medium">
                      {numFormat(
                        panel.data.total.page_view,
                        windowWidth > BREAKPOINTS.MD ? "standard" : "compact",
                        2
                      )}
                    </h3>
                  </Card>
                  <Card className="flex h-full flex-col justify-between space-y-3">
                    <h4 className="flex gap-3 text-base">
                      {t("home.section_1.resource_downloads")}
                    </h4>
                    <h3 className="font-medium">
                      {numFormat(panel.data.total.file_download, "standard")}
                    </h3>
                  </Card>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <Card className="space-y-3">
                    <Ranking
                      type="dashboard"
                      ranks={panel.data.top_dashboards}
                      title={["🔥", t("home.section_1.top_dashboards")]}
                      icon={<EyeIcon className="h-4 w-4" />}
                    />
                  </Card>
                  <Card className="space-y-3">
                    <Ranking
                      type={"default"}
                      ranks={panel.data.top_catalogues}
                      title={["🔥", t("home.section_1.top_catalogues")]}
                      icon={<EyeIcon className="h-4 w-4" />}
                    />
                  </Card>
                  <Card className="space-y-3">
                    <Ranking
                      type={"default"}
                      ranks={panel.data.top_files}
                      title={["🔢", t("home.section_1.top_files")]}
                      icon={<DocumentArrowDownIcon className="h-4 w-4" />}
                    />
                  </Card>
                  <Card className="space-y-3">
                    <Ranking
                      type={"default"}
                      ranks={panel.data.top_images}
                      title={["📊", t("home.section_1.top_images")]}
                      icon={<DocumentArrowDownIcon className="h-4 w-4" />}
                    />
                  </Card>
                </div>
              </Panel>
            ))}
          </Tabs>
        </Section>
        <Section title={t("home.section_2.title")} date={timeseries.data_as_of}>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <Timeseries
              className="h-[300px] w-full"
              title={t("home.keys.views")}
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    data: coordinate.views,
                    borderColor: AKSARA_COLOR.PRIMARY,
                    label: t("home.keys.views"),
                    borderWidth: 1.5,
                    backgroundColor: AKSARA_COLOR.OUTLINE,
                    fill: true,
                  },
                ],
              }}
              stats={[
                {
                  title: t("common.latest", {
                    date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                  }),
                  value: numFormat(timeseries_callouts.data.views.callout, "standard"),
                },
              ]}
            />
            <Timeseries
              className="h-[300px] w-full"
              title={t("home.keys.users")}
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    data: coordinate.users,
                    borderColor: AKSARA_COLOR.PRIMARY,
                    borderWidth: 1.5,
                    label: t("home.keys.users"),
                    backgroundColor: AKSARA_COLOR.OUTLINE,
                    fill: true,
                  },
                ],
              }}
              stats={[
                {
                  title: t("common.latest", {
                    date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                  }),
                  value: numFormat(timeseries_callouts.data.users.callout, "standard"),
                },
              ]}
            />
            <Timeseries
              className="h-[300px] w-full"
              title={t("home.keys.downloads")}
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    data: coordinate.downloads,
                    borderColor: AKSARA_COLOR.PRIMARY,
                    label: t("home.keys.downloads"),
                    backgroundColor: AKSARA_COLOR.OUTLINE,
                    fill: true,
                    borderWidth: 1.5,
                  },
                ],
              }}
              stats={[
                {
                  title: t("common.latest", {
                    date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                  }),
                  value: numFormat(timeseries_callouts.data.downloads.callout, "standard"),
                },
              ]}
            />
          </div>

          <Slider
            className="pt-12"
            type="range"
            value={data.minmax}
            data={timeseries.data.x}
            onChange={e => setData("minmax", e)}
          />
        </Section>
      </Container>
    </>
  );
};

type RankItem =
  | {
      id: string;
      name: {
        "ms-MY": string;
        "en-GB": string;
      };
      route: never;
      value: number;
    }
  | {
      id: string;
      route: string;
      value: number;
      name: never;
    };
interface RankingProps {
  type: "default" | "dashboard";
  title: [ReactNode, string];
  ranks: RankItem[];
  icon: ReactNode;
}

const Ranking = ({ title, ranks, type = "default", icon }: RankingProps) => {
  const { t, i18n } = useTranslation();
  return {
    default: (
      <>
        <h4 className="flex gap-3 text-base">
          <span>{title[0]}</span>
          {title[1]}
        </h4>
        <ol className="list-inside space-y-3">
          {ranks.map((item: RankItem, index: number) => (
            <li className="flex items-start justify-between">
              <At href={`/data-catalogue/${item.id}`} className="flex gap-5">
                <span className="text-dim">{index + 1}</span>
                <span className="hover:underline">
                  {item.name && item.name[i18n.language as "ms-MY" | "en-GB"]}
                </span>
              </At>
              <p className="flex items-center gap-2">
                {icon}
                <span>{numFormat(item.value, "compact")}</span>
              </p>
            </li>
          ))}
        </ol>
      </>
    ),
    dashboard: (
      <>
        <h4 className="flex gap-3 text-base">
          <span>{title[0]}</span>
          {title[1]}
        </h4>
        <ol className="list-inside space-y-3">
          {ranks.map((item: RankItem, index: number) => (
            <li className="flex items-start justify-between">
              <At href={item.route} className="flex gap-5">
                <span className="text-dim">{index + 1}</span>
                <span className="hover:underline">{t(item.id)}</span>
              </At>
              <p className="flex items-center gap-2">
                {icon}
                <span>{numFormat(item.value, "compact")}</span>
              </p>
            </li>
          ))}
        </ol>
      </>
    ),
  }[type];
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);
  //   const { data } = await get("/data-catalog/", { lang: SHORT_LANG[locale!], ...query });
  const { data } = await get("/dashboard", { dashboard: "homepage" });
  //   const { data: total } = await get("/api/analytics/total", undefined, "local");
  //   const { data: top_files } = await get("/api/analytics/downloads", { type: "file" }, "local");
  //   const { data: top_images } = await get("/api/analytics/downloads", { type: "image" }, "local");
  //   const { data: top_catalogues } = await get(
  //     "/api/analytics/page_views",
  //     { type: "catalogue" },
  //     "local"
  //   );
  //   const { data: top_dashboards } = await get(
  //     "/api/analytics/page_views",
  //     { type: "dashboard" },
  //     "local"
  //   );

  return {
    props: {
      ...i18n,
      timeseries_callouts: data.statistics,
      timeseries: data.timeseries,
      analytics: {
        total: {
          page_view: 18575643,
          file_download: 50000,
        },
        top_files: DUMMY_DOWNLOADS(300000),
        top_images: DUMMY_DOWNLOADS(200000),
        top_catalogues: DUMMY_DOWNLOADS(500000),
        top_dashboards: DUMMY_DASHBOARDS(1500000),
      },
    },
    revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
};

export default Home;

const DUMMY_DOWNLOADS = (max: number) => [
  {
    id: "dosm-public-agriculture_principal_statistics_cattle_7",
    name: {
      "en-GB": "Cattle: Export Beef Cattle",
      "ms-MY": "Lembu:  Export Daging Lembu",
    },
    value: randomize(max),
  },
  {
    id: "dosm-public-agriculture_principal_statistics_cattle_8",
    name: {
      "en-GB": "Cattle: Export Beef Cattle RM",
      "ms-MY": "Lembu:  Eksport Daging Lembu RM",
    },
    value: randomize(max),
  },
  {
    id: "dosm-public-agriculture_principal_statistics_cattle_5",
    name: {
      "en-GB": "Cattle: Imports Beef",
      "ms-MY": "Lembu: Import Daging Lembu RM",
    },
    value: randomize(max),
  },
  {
    id: "dosm-public-agriculture_principal_statistics_cattle_3",
    name: {
      "en-GB": "Cattle: Imports Live Cattle",
      "ms-MY": "Lembu: Import Lembu Hidup",
    },
    value: randomize(max),
  },
  {
    id: "dosm-public-agriculture_principal_statistics_cattle_1",
    name: {
      "en-GB": "Cattle: Population",
      "ms-MY": "Lembu: Populasi",
    },
    value: randomize(max),
  },
];

const DUMMY_DASHBOARDS = (max: number) => [
  {
    id: "compositeindex.header",
    route: routes.COMPOSITE_INDEX,
    value: randomize(max),
  },
  {
    id: "drug.header",
    route: routes.DRUG,
    value: randomize(max),
  },
  {
    id: "moneysupply.header",
    route: routes.MONEY_SUPPLY,
    value: randomize(max),
  },
  {
    id: "reservemoney.header",
    route: routes.RESERVE_MONEY,
    value: randomize(max),
  },
  {
    id: "industry.header",
    route: routes.INDUSTRIAL_PRODUCTION,
    value: randomize(max),
  },
];

const randomize = (max: number) => {
  return Math.random() * (max - 100) + 100;
};

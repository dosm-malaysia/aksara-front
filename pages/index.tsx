import type { Page } from "@lib/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
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
import { AKSARA_COLOR } from "@lib/constants";
import { numFormat, toDate } from "@lib/helpers";

const Table = dynamic(() => import("@components/Chart/Table"), { ssr: false });
const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

const Home: Page = ({ timeseries }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const DUMMY_TABLE = () => {
    return (
      <Table
        className="table-stripe"
        enablePagination
        data={Array(50)
          .fill(null)
          .map((_, index) => {
            const count: number = index++;
            return {
              col_0: count,
              col_1: "Dataset #" + count,
              col_2: count * 100,
              col_3: count * 10,
              col_4: count * 50,
            };
          })}
        config={[
          {
            id: "col_0",
            header: "#",
            accessorKey: "col_0",
            enableSorting: false,
          },
          {
            id: "col_1",
            header: "Dataset",
            accessorKey: "col_1",
          },
          {
            id: "col_2",
            header: "Views",
            accessorKey: "col_2",
          },
          {
            id: "col_3",
            header: "Data Download",
            accessorKey: "col_3",
          },
          {
            id: "col_4",
            header: "Graphic Download",
            accessorKey: "col_4",
          },
        ]}
      />
    );
  };

  const LATEST_TIMESTAMP = timeseries.data.index.x[timeseries.data.index.x.length - 1];

  const { t, i18n } = useTranslation();
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
      <Container className="min-h-screen ">
        <Section title={t("home.section_1.title")} description={t("home.section_1.description")}>
          <Tabs>
            <Panel name="Today">
              <div className="mx-auto lg:max-w-screen-md">{DUMMY_TABLE()}</div>
            </Panel>
            <Panel name="Past 1 month">
              <div className="mx-auto lg:max-w-screen-md">{DUMMY_TABLE()}</div>
            </Panel>
            <Panel name="All time">
              <div className="mx-auto lg:max-w-screen-md">{DUMMY_TABLE()}</div>
            </Panel>
          </Tabs>
        </Section>
        <Section title={t("home.section_2.title")}>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <Timeseries
              title="Daily Views"
              data={{
                labels: timeseries.data.index.x,
                datasets: [
                  {
                    type: "line",
                    data: timeseries.data.index.leading,
                    label: t("compositeindex.keys.leading"),
                    borderColor: AKSARA_COLOR.PRIMARY,
                    borderWidth: 1.5,
                    backgroundColor: AKSARA_COLOR.PRIMARY_H,
                    fill: true,
                  },
                ],
              }}
              stats={[
                {
                  title: t("common.latest", {
                    date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                  }),
                  value: numFormat(
                    timeseries.data.index.leading[timeseries.data.index.leading.length - 1],
                    "standard"
                  ),
                },
              ]}
            />
            <Timeseries
              title="Daily Users"
              data={{
                labels: timeseries.data.index.x,
                datasets: [
                  {
                    type: "line",
                    data: timeseries.data.index.coincident,
                    label: t("compositeindex.keys.coincident"),
                    borderColor: AKSARA_COLOR.PRIMARY,
                    borderWidth: 1.5,
                    backgroundColor: AKSARA_COLOR.PRIMARY_H,
                    fill: true,
                  },
                ],
              }}
              stats={[
                {
                  title: t("common.latest", {
                    date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                  }),
                  value: numFormat(
                    timeseries.data.index.coincident[timeseries.data.index.coincident.length - 1],
                    "standard"
                  ),
                },
              ]}
            />
            <Timeseries
              title="Daily Data Downloads"
              data={{
                labels: timeseries.data.index.x,
                datasets: [
                  {
                    type: "line",
                    data: timeseries.data.index.lagging,
                    label: t("compositeindex.keys.lagging"),
                    borderColor: AKSARA_COLOR.PRIMARY,
                    borderWidth: 1.5,
                    backgroundColor: AKSARA_COLOR.PRIMARY_H,
                    fill: true,
                  },
                ],
              }}
              stats={[
                {
                  title: t("common.latest", {
                    date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                  }),
                  value: numFormat(
                    timeseries.data.index.lagging[timeseries.data.index.lagging.length - 1],
                    "standard"
                  ),
                },
              ]}
            />
          </div>

          <Slider className="pt-12" type="range" />
        </Section>
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale, query }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);
  //   const { data } = await get("/data-catalog/", { lang: SHORT_LANG[locale!], ...query });
  const { data } = await get("/dashboard", { dashboard: "mei_dashboard" });
  //   const { data: analytics } = await get("/api/analytics", { dashboard: "mei_dashboard" });

  //   const collection = Object.entries(data.dataset).map(([key, item]: [string, unknown]) => [
  //     key,
  //     sortAlpha(item as Array<Record<string, any>>, "catalog_name"),
  //   ]);
  return {
    props: {
      ...i18n,
      //   query: query ?? {},
      //   total: data.total_all,
      timeseries: data.timeseries,
    },
  };
};

export default Home;

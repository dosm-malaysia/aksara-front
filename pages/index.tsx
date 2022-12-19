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
import { AKSARA_COLOR } from "@lib/constants";
import { numFormat, toDate } from "@lib/helpers";
import Card from "@components/Card";
import { EyeIcon } from "@heroicons/react/24/solid";
import At from "@components/At";

const Table = dynamic(() => import("@components/Chart/Table"), { ssr: false });
const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

const Home: Page = ({ timeseries, analytics }: InferGetStaticPropsType<typeof getStaticProps>) => {
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
              <div className="grid grid-cols-4 gap-6 py-6">
                <Card className="space-y-3">
                  <h4 className="flex gap-3 text-base">Dashboards</h4>
                </Card>
                <Card className="space-y-3">
                  <h4 className="flex gap-3 text-base">Datasets available</h4>
                </Card>
                <Card className="space-y-3">
                  <h4 className="flex gap-3 text-base">Resource views</h4>
                </Card>
                <Card className="space-y-3">
                  <h4 className="flex gap-3 text-base">Resource downloads</h4>
                </Card>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <Card className="space-y-3">
                  <h4 className="flex gap-3 text-base">
                    <span>🔥</span> Most viewed dashboards
                  </h4>
                  <ol className="list-inside space-y-3">
                    {analytics.top_files.map((file: any, index: number) => (
                      <li className="flex justify-between">
                        <At href={`/data-catalogue/${file.id}`} className="flex gap-5">
                          <span className="text-dim">{index + 1}</span>
                          <span className="hover:underline">{file.name[i18n.language]}</span>
                        </At>
                        <p className="flex items-center gap-2">
                          <EyeIcon className="h-4 w-4" />
                          <span>{numFormat(file.value, "compact")}</span>
                        </p>
                      </li>
                    ))}
                  </ol>
                </Card>
                <Card className="space-y-3">
                  <h4 className="flex gap-3 text-base">
                    <span>🔥</span> Most viewed datasets
                  </h4>
                  <ol className="list-inside space-y-3">
                    {analytics.top_files.map((file: any, index: number) => (
                      <li className="flex justify-between">
                        <At href={`/data-catalogue/${file.id}`} className="flex gap-5">
                          <span className="text-dim">{index + 1}</span>
                          <span className="hover:underline">{file.name[i18n.language]}</span>
                        </At>
                        <p className="flex items-center gap-2">
                          <EyeIcon className="h-4 w-4" />
                          <span>{numFormat(file.value, "compact")}</span>
                        </p>
                      </li>
                    ))}
                  </ol>
                </Card>
                <Card className="space-y-3">
                  <h4 className="flex gap-3 text-base">
                    <span>🔢</span> Most Downloaded (Data)
                  </h4>
                  <ol className="list-inside space-y-3">
                    {analytics.top_files.map((file: any, index: number) => (
                      <li className="flex justify-between">
                        <At href={`/data-catalogue/${file.id}`} className="flex gap-5">
                          <span className="text-dim">{index + 1}</span>
                          <span className="hover:underline">{file.name[i18n.language]}</span>
                        </At>
                        <p className="flex items-center gap-2">
                          <EyeIcon className="h-4 w-4" />
                          <span>{numFormat(file.value, "compact")}</span>
                        </p>
                      </li>
                    ))}
                  </ol>
                </Card>
                <Card className="space-y-3">
                  <h4 className="flex gap-3 text-base">
                    <span>📊</span> Most Downloaded (Graphics)
                  </h4>
                  <ol className="list-inside space-y-3">
                    {analytics.top_images.map((image: any, index: number) => (
                      <li className="flex justify-between">
                        <At href={`/data-catalogue/${image.id}`} className="flex gap-5">
                          <span className="text-dim">{index + 1}</span>
                          <span className="hover:underline">{image.name[i18n.language]}</span>
                        </At>
                        <p className="flex items-center gap-2">
                          <EyeIcon className="h-4 w-4" />
                          <span>{numFormat(image.value, "compact")}</span>
                        </p>
                      </li>
                    ))}
                  </ol>
                </Card>
              </div>
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

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);
  //   const { data } = await get("/data-catalog/", { lang: SHORT_LANG[locale!], ...query });
  const { data } = await get("/dashboard", { dashboard: "mei_dashboard" });
  const { data: top_files } = await get("/api/analytics/downloads", { type: "file" }, "local");
  const { data: top_images } = await get("/api/analytics/downloads", { type: "image" }, "local");

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
      analytics: {
        top_files,
        top_images,
      },
    },
    revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
};

export default Home;

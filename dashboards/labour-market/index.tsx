import {
  Hero,
  Container,
  Tabs,
  Panel,
  Slider,
  Section,
  BarMeter,
  Dropdown,
} from "@components/index";
import { FunctionComponent } from "react";
import dynamic from "next/dynamic";
import { default as Image } from "next/image";
import { useTranslation } from "next-i18next";
import { useData } from "@hooks/useData";
import { useSlice } from "@hooks/useSlice";
import { CountryAndStates, COVID_COLOR, GRAYBAR_COLOR } from "@lib/constants";
import type { OptionType } from "@components/types";
import { flip, numFormat, toDate } from "@lib/helpers";

const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });
const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });
const Table = dynamic(() => import("@components/Chart/Table"), { ssr: false });

interface LabourMarketProps {
  last_updated: number;
  bar: any;
  timeseries: any;
  choropleth: any;
  timeseries_callouts: any;
}

const LabourMarketDashboard: FunctionComponent<LabourMarketProps> = ({
  last_updated,
  bar,
  timeseries,
  choropleth,
  timeseries_callouts,
}) => {
  const { t, i18n } = useTranslation();
  const indicatorOptions: Array<OptionType> = Object.keys(choropleth.data).map((key: string) => ({
    label: t(`labour.keys.${key}`),
    value: key,
  }));
  const { data, setData } = useData({
    minmax: [timeseries.data.x.length - 24, timeseries.data.x.length - 1], // [2 years ago, today]
    indicator: indicatorOptions[0],
    indicators: Object.fromEntries(
      Object.entries(choropleth.data).map(([key, value]) => [
        key,
        (value as Array<Record<string, string | number>>).map(item => ({
          ...item,
          id: CountryAndStates[item.id],
        })),
      ])
    ),
  });
  const { coordinate } = useSlice(timeseries.data, data.minmax);

  return (
    <>
      <Hero background="bg-[#F8EDED]">
        <div className="space-y-4 xl:w-2/3">
          <span className="text-sm font-bold uppercase tracking-widest text-dim">
            {t("nav.megamenu.categories.economy")}
          </span>
          <h3 className="text-black">{t("labour.header")}</h3>
          <p className="text-dim">{t("labour.description")}</p>

          <p className="text-sm text-dim">
            {t("common.last_updated", {
              date: toDate(last_updated, "dd MMM yyyy, HH:mm", i18n.language),
            })}
          </p>
        </div>
      </Hero>

      <Container className="min-h-screen">
        {/* How is unemployment trending? */}
        <Section
          title={t("labour.section_1.title")}
          description={t("labour.section_1.description")}
        >
          <div className="space-y-4">
            <Timeseries
              className="h-[350px] w-full pt-6"
              title={t("labour.keys.unemployment_rate")}
              interval="month"
              unitY="%"
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    data: coordinate.unemployment_rate,
                    borderColor: COVID_COLOR[300],
                    borderWidth: 1.5,
                  },
                  {
                    type: "bar",
                    label: t("labour.keys.unemployment_rate"),
                    data: coordinate.unemployment_rate,
                    backgroundColor: GRAYBAR_COLOR[300],
                  },
                ],
              }}
            />

            <Slider
              className="pt-7"
              type="range"
              value={data.minmax}
              data={timeseries.data.x}
              period="month"
              onChange={e => setData("minmax", e)}
            />
            <span className="text-sm text-dim">{t("common.slider")}</span>
          </div>
        </Section>

        {/* How are other key labour market indicators trending? */}
        <Section title={"How are other key labour market indicators trending?"}>
          <div className="grid grid-cols-1 gap-12 pb-6 lg:grid-cols-2 xl:grid-cols-3">
            <Timeseries
              title={t("labour.keys.labour_force_participation")}
              className="h-[250px] w-full pt-6"
              interval="month"
              unitY="%"
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    data: coordinate.labour_force_participation,
                    borderColor: COVID_COLOR[300],
                    borderWidth: 1.5,
                  },
                  {
                    type: "bar",
                    label: t("labour.keys.labour_force_participation"),
                    data: coordinate.labour_force_participation,
                    backgroundColor: GRAYBAR_COLOR[300],
                  },
                ],
              }}
              stats={[
                {
                  title: t("common.latest", {
                    date: toDate(last_updated, "MMM yyyy", i18n.language),
                  }),
                  value: `${timeseries_callouts.data.p_rate.callout1.toLocaleString()}%`,
                },
              ]}
            />
            <Timeseries
              title={t("labour.keys.under_employment_rate")}
              className="h-[250px] w-full pt-6"
              interval="month"
              unitY="%"
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    data: coordinate.under_employment_rate,
                    borderColor: COVID_COLOR[300],
                    borderWidth: 1.5,
                  },
                  {
                    type: "bar",
                    label: t("labour.keys.under_employment_rate"),
                    data: coordinate.under_employment_rate,
                    backgroundColor: GRAYBAR_COLOR[300],
                  },
                ],
              }}
              stats={[
                {
                  title: t("common.latest", {
                    date: toDate(last_updated, "MMM yyyy", i18n.language),
                  }),
                  value: `${timeseries_callouts.data.u_rate.callout1.toLocaleString()}%`,
                },
              ]}
            />
            <Timeseries
              title={t("labour.keys.employment_population_ratio")}
              className="h-[250px] w-full pt-6"
              interval="month"
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    data: coordinate.employment_population_ratio,
                    borderColor: COVID_COLOR[300],
                    borderWidth: 1.5,
                  },
                  {
                    type: "bar",
                    label: t("labour.keys.employment_population_ratio"),
                    data: coordinate.employment_population_ratio,
                    backgroundColor: GRAYBAR_COLOR[300],
                  },
                ],
              }}
              stats={[
                {
                  title: t("common.latest", {
                    date: toDate(last_updated, "MMM yyyy", i18n.language),
                  }),
                  value: `${timeseries_callouts.data.ep_ratio.callout1.toLocaleString()}`,
                },
              ]}
            />
            <Timeseries
              title={t("labour.keys.unemployed_persons")}
              className="h-[250px] w-full pt-6"
              interval="month"
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    data: coordinate.unemployed_persons,
                    borderColor: COVID_COLOR[300],
                    borderWidth: 1.5,
                  },
                  {
                    type: "bar",
                    label: t("labour.keys.unemployed_persons"),
                    data: coordinate.unemployed_persons,
                    backgroundColor: GRAYBAR_COLOR[300],
                  },
                ],
              }}
              stats={[
                {
                  title: t("common.latest", {
                    date: toDate(last_updated, "MMM yyyy", i18n.language),
                  }),
                  value: `${timeseries_callouts.data.unemployed.callout1.toLocaleString()}`,
                },
              ]}
            />
            <Timeseries
              title={t("labour.keys.own_account_workers")}
              className="h-[250px] w-full pt-6"
              interval="month"
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    data: coordinate.own_account_workers,
                    borderColor: COVID_COLOR[300],
                    borderWidth: 1.5,
                  },
                  {
                    type: "bar",
                    label: t("labour.keys.own_account_workers"),
                    data: coordinate.own_account_workers,
                    backgroundColor: GRAYBAR_COLOR[300],
                  },
                ],
              }}
              stats={[
                {
                  title: t("common.latest", {
                    date: toDate(last_updated, "MMM yyyy", i18n.language),
                  }),
                  value: `${timeseries_callouts.data.own_account.callout1.toLocaleString()}`,
                },
              ]}
            />
            <Timeseries
              title={t("labour.keys.outside_labour_force")}
              className="h-[250px] w-full pt-6"
              interval="month"
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    data: coordinate.outside_labour_force,
                    borderColor: COVID_COLOR[300],
                    borderWidth: 1.5,
                  },
                  {
                    type: "bar",
                    label: t("labour.keys.outside_labour_force"),
                    data: coordinate.outside_labour_force,
                    backgroundColor: GRAYBAR_COLOR[300],
                  },
                ],
              }}
              stats={[
                {
                  title: t("common.latest", {
                    date: toDate(last_updated, "MMM yyyy", i18n.language),
                  }),
                  value: `${timeseries_callouts.data.outside.callout1.toLocaleString()}`,
                },
              ]}
            />
          </div>
        </Section>

        {/* A deeper look at the latest labour market snapshot */}
        <Section title={t("labour.section_3.title")}>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <BarMeter
              title={t("labour.section_3.bar1_header")}
              data={bar.data.employed_status.map((item: any) => ({
                ...item,
                x: t(`labour.keys.${item.x}`),
              }))}
              layout="horizontal"
              unit="%"
              className="flex-col"
            />
            <BarMeter
              title={t("labour.section_3.bar2_header")}
              layout="horizontal"
              unit="%"
              data={bar.data.unemployed_status.map((item: any) => ({
                ...item,
                x: t(`labour.keys.${item.x}`),
              }))}
              className="flex-col"
            />
            <BarMeter
              title={t("labour.section_3.bar3_header")}
              layout="horizontal"
              unit="%"
              data={bar.data.out_reason.map((item: any) => ({
                ...item,
                x: t(`labour.keys.${item.x}`),
              }))}
              className="flex-col"
            />
          </div>
        </Section>
        {/* How do key labour market indicators vary across states? */}
        <Section title={t("labour.section_4.title")}>
          <div>
            <Tabs
              className="flex flex-wrap justify-end gap-2 pb-4"
              title={
                <Dropdown
                  anchor="left"
                  sublabel={t("common.indicator") + ":"}
                  options={indicatorOptions}
                  selected={data.indicator}
                  onChange={e => setData("indicator", e)}
                />
              }
            >
              <Panel name={t("common.charts.heatmap")}>
                <Choropleth
                  data={data.indicators[data.indicator.value]}
                  colorScale="blues"
                  enableScale
                />
              </Panel>
              <Panel name={t("common.charts.table")}>
                <div className="mx-auto w-full md:max-w-screen-md">
                  <Table
                    className="table-stripe table-default"
                    data={data.indicators[data.indicator.value]}
                    config={[
                      {
                        header: t("common.state"),
                        id: "id",
                        accessorKey: "id",
                        enableSorting: false,
                        cell: (item: any) => {
                          const state = item.getValue() as string;
                          return (
                            <div className="flex items-center gap-2">
                              <Image
                                src={`/static/images/states/${flip(CountryAndStates)[state]}.jpeg`}
                                width={20}
                                height={12}
                                alt={flip(CountryAndStates)[state]}
                              />
                              <span className="text-sm">{state}</span>
                            </div>
                          );
                        },
                      },
                      {
                        header: data.indicator.label,
                        accessorFn: ({ value }: any) => numFormat(value, "standard"),
                        id: "value",
                        sortingFn: "localeNumber",
                        sortDescFirst: true,
                      },
                    ]}
                  />
                </div>
              </Panel>
            </Tabs>
          </div>
        </Section>
      </Container>
    </>
  );
};

export default LabourMarketDashboard;

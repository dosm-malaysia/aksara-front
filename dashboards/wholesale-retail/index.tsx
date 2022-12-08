import { Container, Dropdown, Hero, Section, Slider } from "@components/index";
import { FunctionComponent, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { numFormat, toDate } from "@lib/helpers";
import { useTranslation } from "next-i18next";
import { useSlice } from "@hooks/useSlice";
import { useData } from "@hooks/useData";
import type { OptionType } from "@components/types";
import { AKSARA_COLOR } from "@lib/constants";
import type { ChartDatasetProperties, ChartTypeRegistry } from "chart.js";

const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

interface WholesaleRetailDashboardProps {
  last_updated: number;
  timeseries: any;
}

const WholesaleRetailDashboard: FunctionComponent<WholesaleRetailDashboardProps> = ({
  last_updated,
  timeseries,
}) => {
  const { t, i18n } = useTranslation();
  const INDEX_OPTIONS: Array<OptionType> = Object.keys(timeseries.data).map((key: string) => ({
    label: t(`wholesaleretail.keys.${key}`),
    value: key,
  }));
  const SHADE_OPTIONS: Array<OptionType> = [
    { label: t("wholesaleretail.keys.no_shade"), value: "no_shade" },
    { label: t("wholesaleretail.keys.recession"), value: "recession" },
  ];

  const { data, setData } = useData({
    index_type: INDEX_OPTIONS[0],
    shade_type: SHADE_OPTIONS[0],
    minmax: [0, timeseries.data[INDEX_OPTIONS[0].value].x.length - 1],
  });
  //   const LATEST_TIMESTAMP =
  //     timeseries.data[data.index_type.value].x[timeseries.data[data.index_type.value].x.length - 1];
  const { coordinate } = useSlice(timeseries.data[data.index_type.value], data.minmax);

  const shader = useCallback<
    (key: string) => ChartDatasetProperties<keyof ChartTypeRegistry, any[]>
  >(
    (key: string) => {
      switch (key) {
        case "no_shade":
          return {
            data: [],
          };

        default:
          return {
            type: "line",
            data: coordinate[key],
            backgroundColor: AKSARA_COLOR.WASHED,
            borderWidth: 0,
            fill: true,
            yAxisID: "y2",
            stepped: true,
          };
      }
    },
    [data]
  );

  const configs = useMemo<{ unit: string; prefix: string }>(() => {
    return {
      unit: data.index_type.value.includes("growth") ? "%" : "",
      prefix:
        data.index_type.value.includes("sale") && !data.index_type.value.includes("growth")
          ? "RM "
          : "",
    };
  }, [data.index_type]);

  return (
    <>
      <Hero background="bg-washed">
        <div className="space-y-4 xl:w-2/3">
          <span className="text-sm font-bold uppercase tracking-widest text-primary">
            {t("nav.megamenu.categories.economy")}
          </span>
          <h3>{t("wholesaleretail.header")}</h3>
          <p className="text-dim">{t("wholesaleretail.description")}</p>

          <p className="text-sm text-dim">
            {t("common.last_updated", {
              date: toDate(last_updated, "dd MMM yyyy, HH:mm", i18n.language),
            })}
          </p>
        </div>
      </Hero>

      <Container className="min-h-screen">
        {/* How are the Malaysian Economic Indicators trending? */}
        <Section title={t("wholesaleretail.section_1.title")}>
          <div className="space-y-8">
            <div className="flex flex-row gap-4">
              <Dropdown
                anchor="left"
                selected={data.index_type}
                options={INDEX_OPTIONS}
                onChange={e => setData("index_type", e)}
              />
              <Dropdown
                anchor="left"
                options={SHADE_OPTIONS}
                selected={data.shade_type}
                onChange={e => setData("shade_type", e)}
              />
            </div>

            <Slider
              type="range"
              value={data.minmax}
              data={timeseries.data[data.index_type.value].x}
              period="month"
              onChange={e => setData("minmax", e)}
            />
            <Timeseries
              className="h-[350px] w-full"
              title={t("wholesaleretail.keys.total")}
              interval="month"
              unitY={configs.unit}
              prefixY={configs.prefix}
              axisY={{
                y2: {
                  display: false,
                  grid: {
                    drawTicks: false,
                    drawBorder: false,
                    lineWidth: 0.5,
                  },
                  ticks: {
                    display: false,
                  },
                },
              }}
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    data: coordinate.total,
                    label: t("wholesaleretail.keys.total"),
                    borderColor: AKSARA_COLOR.PRIMARY,
                    borderWidth: 1.5,
                    backgroundColor: AKSARA_COLOR.PRIMARY_H,
                    fill: true,
                  },
                  shader(data.shade_type.value),
                ],
              }}
              //   stats={[
              //     {
              //       title: t("common.latest", {
              //         date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
              //       }),
              //       value: numFormat(timeseries_callouts.data.leading.callout1, "standard"),
              //     },
              //     {
              //       title: t("wholesaleretail.mom_growth"),
              //       value: `${numFormat(timeseries_callouts.data.leading.callout2, "standard")}%`,
              //     },
              //     {
              //       title: t("wholesaleretail.yoy_growth"),
              //       value: `${numFormat(timeseries_callouts.data.leading.callout3, "standard")}%`,
              //     },
              //   ]}
            />

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              <Timeseries
                title={t("wholesaleretail.keys.wholesale")}
                className="h-[350px] w-full"
                interval="month"
                unitY={configs.unit}
                prefixY={configs.prefix}
                axisY={{
                  y2: {
                    display: false,
                    grid: {
                      drawTicks: false,
                      drawBorder: false,
                      lineWidth: 0.5,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                }}
                data={{
                  labels: coordinate.x,
                  datasets: [
                    {
                      type: "line",
                      label: t("wholesaleretail.keys.wholesale"),
                      data: coordinate.wholesale,
                      borderColor: AKSARA_COLOR.PRIMARY,
                      backgroundColor: AKSARA_COLOR.PRIMARY_H,
                      fill: true,
                      borderWidth: 1.5,
                    },
                    shader(data.shade_type.value),
                  ],
                }}
              />
              <Timeseries
                title={t("wholesaleretail.keys.retail")}
                className="h-[350px] w-full"
                interval="month"
                unitY={configs.unit}
                prefixY={configs.prefix}
                axisY={{
                  y2: {
                    display: false,
                    grid: {
                      drawTicks: false,
                      drawBorder: false,
                      lineWidth: 0.5,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                }}
                data={{
                  labels: coordinate.x,
                  datasets: [
                    {
                      type: "line",
                      label: t("wholesaleretail.keys.retail"),
                      data: coordinate.retail,
                      borderColor: AKSARA_COLOR.PRIMARY,
                      backgroundColor: AKSARA_COLOR.PRIMARY_H,
                      fill: true,
                      borderWidth: 1.5,
                    },
                    shader(data.shade_type.value),
                  ],
                }}
              />
              <Timeseries
                title={t("wholesaleretail.keys.motor")}
                className="h-[350px] w-full"
                interval="month"
                unitY={configs.unit}
                prefixY={configs.prefix}
                axisY={{
                  y2: {
                    display: false,
                    grid: {
                      drawTicks: false,
                      drawBorder: false,
                      lineWidth: 0.5,
                    },
                    ticks: {
                      display: false,
                    },
                  },
                }}
                data={{
                  labels: coordinate.x,
                  datasets: [
                    {
                      type: "line",
                      label: t("wholesaleretail.keys.motor"),
                      data: coordinate.motor,
                      borderColor: AKSARA_COLOR.PRIMARY,
                      backgroundColor: AKSARA_COLOR.PRIMARY_H,
                      fill: true,
                      borderWidth: 1.5,
                    },
                    shader(data.shade_type.value),
                  ],
                }}
              />
            </div>
          </div>
        </Section>
      </Container>
    </>
  );
};

export default WholesaleRetailDashboard;

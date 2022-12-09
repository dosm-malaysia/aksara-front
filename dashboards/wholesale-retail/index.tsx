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
  timeseries_callouts: any;
}

const WholesaleRetailDashboard: FunctionComponent<WholesaleRetailDashboardProps> = ({
  last_updated,
  timeseries,
  timeseries_callouts,
}) => {
  const { t, i18n } = useTranslation();
  const sortedIndices = [
    "growth_index_yoy",
    "growth_sales_yoy",
    "growth_index_momsa",
    "index",
    "index_sa",
    "sales",
  ];
  const INDEX_OPTIONS: Array<OptionType> = sortedIndices.map((key: string) => ({
    label: t(`wholesaleretail.keys.${key}`),
    value: key,
  }));

  const SHADE_OPTIONS: Array<OptionType> = [
    { label: t("wholesaleretail.keys.no_shade"), value: "no_shade" },
    { label: t("wholesaleretail.keys.recession"), value: "recession" },
  ];

  const AXIS_Y = {
    y2: {
      display: false,
      grid: {
        drawTicks: false,
        drawBorder: false,
      },
      ticks: {
        display: false,
      },
    },
  };

  const { data, setData } = useData({
    index_type: INDEX_OPTIONS[0],
    shade_type: SHADE_OPTIONS[0],
    minmax: [0, timeseries.data[INDEX_OPTIONS[0].value].x.length - 1],
  });
  const LATEST_TIMESTAMP = useMemo(
    () =>
      timeseries.data[data.index_type.value].x[timeseries.data[data.index_type.value].x.length - 1],
    [data.index_type]
  );

  const { coordinate } = useSlice(timeseries.data[data.index_type.value], data.minmax);

  const shader = useCallback<
    (key: string) => ChartDatasetProperties<keyof ChartTypeRegistry, any[]>
  >(
    (key: string) => {
      if (key === "no_shade")
        return {
          data: [],
        };

      return {
        type: "line",
        data: coordinate[key],
        backgroundColor: AKSARA_COLOR.BLACK_H,
        borderWidth: 0,
        fill: true,
        yAxisID: "y2",
        stepped: true,
      };
    },
    [data]
  );

  const configs = useCallback<
    (key: string) => { unit: string; prefix: string; callout: string; fill: boolean }
  >(
    (key: string) => {
      const prefix =
        data.index_type.value.includes("sale") && !data.index_type.value.includes("growth");

      const unit = data.index_type.value.includes("growth") ? "%" : "";
      return {
        unit: unit,
        prefix: prefix ? "RM " : "",
        callout: [
          prefix ? "RM " : "",
          numFormat(
            timeseries_callouts.data[data.index_type.value][key].callout,
            "standard",
            prefix ? 2 : 1
          ),
          unit,
        ].join(""),
        fill: data.shade_type.value === "no_shade",
      };
    },
    [data.index_type, data.shade_type]
  );

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
              unitY={configs("total").unit}
              prefixY={configs("total").prefix}
              axisY={AXIS_Y}
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
                    fill: configs("total").fill,
                  },
                  shader(data.shade_type.value),
                ],
              }}
              stats={[
                {
                  title: t("common.latest", {
                    date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                  }),
                  value: configs("total").callout,
                },
              ]}
            />

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              <Timeseries
                title={t("wholesaleretail.keys.wholesale")}
                className="h-[350px] w-full"
                interval="month"
                unitY={configs("wholesale").unit}
                prefixY={configs("wholesale").prefix}
                axisY={AXIS_Y}
                data={{
                  labels: coordinate.x,
                  datasets: [
                    {
                      type: "line",
                      label: t("wholesaleretail.keys.wholesale"),
                      data: coordinate.wholesale,
                      borderColor: AKSARA_COLOR.PRIMARY,
                      backgroundColor: AKSARA_COLOR.PRIMARY_H,
                      fill: configs("wholesale").fill,
                      borderWidth: 1.5,
                    },
                    shader(data.shade_type.value),
                  ],
                }}
                stats={[
                  {
                    title: t("common.latest", {
                      date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                    }),
                    value: configs("wholesale").callout,
                  },
                ]}
              />
              <Timeseries
                title={t("wholesaleretail.keys.retail")}
                className="h-[350px] w-full"
                interval="month"
                unitY={configs("retail").unit}
                prefixY={configs("retail").prefix}
                axisY={AXIS_Y}
                data={{
                  labels: coordinate.x,
                  datasets: [
                    {
                      type: "line",
                      label: t("wholesaleretail.keys.retail"),
                      data: coordinate.retail,
                      borderColor: AKSARA_COLOR.PRIMARY,
                      backgroundColor: AKSARA_COLOR.PRIMARY_H,
                      fill: configs("retail").fill,
                      borderWidth: 1.5,
                    },
                    shader(data.shade_type.value),
                  ],
                }}
                stats={[
                  {
                    title: t("common.latest", {
                      date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                    }),
                    value: configs("retail").callout,
                  },
                ]}
              />
              <Timeseries
                title={t("wholesaleretail.keys.motor")}
                className="h-[350px] w-full"
                interval="month"
                unitY={configs("motor").unit}
                prefixY={configs("motor").prefix}
                axisY={AXIS_Y}
                data={{
                  labels: coordinate.x,
                  datasets: [
                    {
                      type: "line",
                      label: t("wholesaleretail.keys.motor"),
                      data: coordinate.motor,
                      borderColor: AKSARA_COLOR.PRIMARY,
                      backgroundColor: AKSARA_COLOR.PRIMARY_H,
                      fill: configs("motor").fill,
                      borderWidth: 1.5,
                    },
                    shader(data.shade_type.value),
                  ],
                }}
                stats={[
                  {
                    title: t("common.latest", {
                      date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                    }),
                    value: configs("motor").callout,
                  },
                ]}
              />
            </div>
          </div>
        </Section>
      </Container>
    </>
  );
};

export default WholesaleRetailDashboard;

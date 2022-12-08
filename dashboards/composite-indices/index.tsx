import { Container, Dropdown, Hero, Section, Slider } from "@components/index";
import { FunctionComponent, useCallback } from "react";
import dynamic from "next/dynamic";
import { numFormat, toDate } from "@lib/helpers";
import { useTranslation } from "next-i18next";
import { useSlice } from "@hooks/useSlice";
import { useData } from "@hooks/useData";
import type { OptionType } from "@components/types";
import { AKSARA_COLOR } from "@lib/constants";
import type { ChartDatasetProperties, ChartTypeRegistry } from "chart.js";

const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

interface CompositeIndexDashboardProps {
  last_updated: number;
  timeseries: any;
  timeseries_callouts: any;
}

const CompositeIndexDashboard: FunctionComponent<CompositeIndexDashboardProps> = ({
  last_updated,
  timeseries,
  timeseries_callouts,
}) => {
  const { t, i18n } = useTranslation();
  const INDEX_OPTIONS: Array<OptionType> = Object.keys(timeseries.data).map((key: string) => ({
    label: t(`compositeindex.keys.${key}`),
    value: key,
  }));
  const SHADE_OPTIONS: Array<OptionType> = [
    { label: t("compositeindex.keys.no_shade"), value: "no_shade" },
    { label: t("compositeindex.keys.recession_growth"), value: "flag_recession_growth" },
    { label: t("compositeindex.keys.recession_business"), value: "flag_recession_business" },
  ];

  const { data, setData } = useData({
    index_type: INDEX_OPTIONS[0],
    shade_type: SHADE_OPTIONS[0],
    minmax: [
      timeseries.data[INDEX_OPTIONS[0].value].x.length - 120,
      timeseries.data[INDEX_OPTIONS[0].value].x.length - 1,
    ],
  });
  const LATEST_TIMESTAMP =
    timeseries.data[data.index_type.value].x[timeseries.data[data.index_type.value].x.length - 1];
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

  return (
    <>
      <Hero background="bg-primary-dark">
        <div className="space-y-4 xl:w-2/3">
          <span className="text-sm font-bold uppercase tracking-widest text-primary">
            {t("nav.megamenu.categories.economy")}
          </span>
          <h3 className="text-white">{t("compositeindex.header")}</h3>
          <p className="text-white">{t("compositeindex.description")}</p>

          <p className="text-sm text-white">
            {t("common.last_updated", {
              date: toDate(last_updated, "dd MMM yyyy, HH:mm", i18n.language),
            })}
          </p>
        </div>
      </Hero>

      <Container className="min-h-screen">
        {/* How are the Malaysian Economic Indicators trending? */}
        <Section
          title={t("compositeindex.section_1.title")}
          description={
            <p className="whitespace-pre-line text-dim">
              {t("compositeindex.section_1.description")}
            </p>
          }
        >
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
              title={t("compositeindex.keys.leading")}
              interval="month"
              unitY={data.index_type.value === "index" ? "" : "%"}
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
                    data: coordinate.leading,
                    label: t("compositeindex.keys.leading"),
                    borderColor: AKSARA_COLOR.PRIMARY,
                    borderWidth: 1.5,
                    backgroundColor: AKSARA_COLOR.PRIMARY_H,
                    fill: true,
                  },
                  shader(data.shade_type.value),
                ],
              }}
              stats={[
                {
                  title: t("common.latest", {
                    date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                  }),
                  value: numFormat(timeseries_callouts.data.leading.callout1, "standard"),
                },
                {
                  title: t("compositeindex.mom_growth"),
                  value: `${numFormat(timeseries_callouts.data.leading.callout2, "standard")}%`,
                },
                {
                  title: t("compositeindex.yoy_growth"),
                  value: `${numFormat(timeseries_callouts.data.leading.callout3, "standard")}%`,
                },
              ]}
            />

            <Timeseries
              title={t("compositeindex.keys.coincident")}
              className="h-[350px] w-full"
              interval="month"
              unitY={data.index_type.value === "index" ? "" : "%"}
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
                    data: coordinate.coincident,
                    label: t("compositeindex.keys.coincident"),
                    borderColor: AKSARA_COLOR.PRIMARY,
                    borderWidth: 1.5,
                    backgroundColor: AKSARA_COLOR.PRIMARY_H,
                    fill: true,
                  },
                  shader(data.shade_type.value),
                ],
              }}
              stats={[
                {
                  title: t("common.latest", {
                    date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                  }),
                  value: numFormat(timeseries_callouts.data.coincident.callout1, "standard"),
                },
                {
                  title: t("compositeindex.mom_growth"),
                  value: `${numFormat(timeseries_callouts.data.coincident.callout2, "standard")}%`,
                },
                {
                  title: t("compositeindex.yoy_growth"),
                  value: `${numFormat(timeseries_callouts.data.coincident.callout3, "standard")}%`,
                },
              ]}
            />
            <Timeseries
              title={t("compositeindex.keys.lagging")}
              className="h-[350px] w-full"
              interval="month"
              unitY={data.index_type.value === "index" ? "" : "%"}
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
                    data: coordinate.lagging,
                    label: t("compositeindex.keys.lagging"),
                    borderColor: AKSARA_COLOR.DANGER,
                    borderWidth: 1.5,
                    backgroundColor: AKSARA_COLOR.DANGER_H,
                    fill: true,
                  },
                  shader(data.shade_type.value),
                ],
              }}
              stats={[
                {
                  title: t("common.latest", {
                    date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                  }),
                  value: numFormat(timeseries_callouts.data.lagging.callout1, "standard"),
                },
                {
                  title: t("compositeindex.mom_growth"),
                  value: `${numFormat(timeseries_callouts.data.lagging.callout2, "standard")}%`,
                },
                {
                  title: t("compositeindex.yoy_growth"),
                  value: `${numFormat(timeseries_callouts.data.lagging.callout3, "standard")}%`,
                },
              ]}
            />
          </div>
        </Section>

        {/*Diffusion indices: A different perspective on the Malaysian Economic Indicators */}
        <Section
          title={t("compositeindex.section_2.title")}
          description={t("compositeindex.section_2.description")}
        >
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <Timeseries
              title={t("compositeindex.keys.leading_diffusion")}
              className="h-[350px] w-full"
              interval="month"
              unitY="%"
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
                    label: t("compositeindex.keys.leading_diffusion"),
                    data: coordinate.leading_diffusion,
                    borderColor: AKSARA_COLOR.PRIMARY,
                    backgroundColor: AKSARA_COLOR.PRIMARY_H,
                    fill: true,
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
                  value: `${timeseries_callouts.data.leading_diffusion.callout1.toLocaleString()}%`,
                },
              ]}
            />
            <Timeseries
              title={t("compositeindex.keys.coincident_diffusion")}
              className="h-[350px] w-full"
              interval="month"
              unitY="%"
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
                    label: t("compositeindex.keys.coincident_diffusion"),
                    data: coordinate.coincident_diffusion,
                    borderColor: AKSARA_COLOR.DANGER,
                    backgroundColor: AKSARA_COLOR.DANGER_H,
                    fill: true,
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
                  value: `${timeseries_callouts.data.coincident_diffusion.callout1.toLocaleString()}%`,
                },
              ]}
            />
          </div>
        </Section>
      </Container>
    </>
  );
};

export default CompositeIndexDashboard;

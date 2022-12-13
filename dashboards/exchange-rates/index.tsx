import { FunctionComponent, useCallback } from "react";
import dynamic from "next/dynamic";
import { sortMulti, toDate } from "@lib/helpers";
import { useTranslation } from "next-i18next";
import { useData } from "@hooks/useData";
import { AKSARA_COLOR, SHORT_LANG } from "@lib/constants";
import { default as Tabs, Panel } from "@components/Tabs";

import Container from "@components/Container";

import Hero from "@components/Hero";
import Section from "@components/Section";

const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });
const Bar = dynamic(() => import("@components/Chart/Bar"), { ssr: false });

interface ExchangeRatesDashboardProps {
  last_updated: number;
  bar: any;
  timeseries: any;
  timeseries_callouts: any;
}

const ExchangeRatesDashboard: FunctionComponent<ExchangeRatesDashboardProps> = ({
  last_updated,
  bar,
  timeseries,
  timeseries_callouts,
}) => {
  const { t, i18n } = useTranslation();
  const lang = SHORT_LANG[i18n.language] as "en" | "bm";
  const { data, setData } = useData({
    active_snapshot: 0,
    active_trend: 0,
  });

  const SNAPSHOT_TAB = ["1w", "1m", "1y", "5y"];
  const TREND_TAB = ["1m", "1y", "5y", "alltime"];
  const CURRENCY = Object.keys(timeseries.data["1m"]).filter(
    key => !["x", "currency0"].includes(key)
  );

  const shader = useCallback<
    ([start, end]: [number, number]) => { borderColor: string; backgroundColor: string }
  >(
    ([start, end]) => {
      const result: number = (end - start) / start;
      const withinMargin = Math.abs(result) < 0.02;

      if (withinMargin)
        return {
          borderColor: AKSARA_COLOR.DIM,
          backgroundColor: AKSARA_COLOR.DIM_H,
        };
      return {
        borderColor: result > 0 ? AKSARA_COLOR.SUCCESS : AKSARA_COLOR.DANGER,
        backgroundColor: result > 0 ? AKSARA_COLOR.SUCCESS_H : AKSARA_COLOR.DANGER_H,
      };
    },
    [data.active_trend]
  );

  /**
   * @todo Refactor this later.
   * @param percent y-value
   * @returns rgb-string
   */
  const getGreenToRed = (percent: number) => {
    const r = percent < 0 ? 255 : Math.floor(200 - (percent * 255) / 10);
    const g = percent > 0 ? 255 : Math.floor((percent * 200) / 10);
    return "rgb(" + r + "," + g + ",0, 0.5)";
  };

  return (
    <>
      <Hero background="bg-washed">
        <div className="space-y-4 xl:w-2/3">
          <span className="text-sm font-bold uppercase tracking-widest text-primary">
            {t("nav.megamenu.categories.financial_sector")}
          </span>
          <h3>{t("exchangerate.header")}</h3>
          <p className="text-dim">{t("exchangerate.description")}</p>

          <p className="text-sm text-dim">
            {t("common.last_updated", {
              date: toDate(last_updated, "dd MMM yyyy, HH:mm", i18n.language),
            })}
          </p>
        </div>
      </Hero>

      <Container className="start-h-screen">
        {/* A snapshot of the Ringgit's performance against major trade partners */}
        <Section
          title={t("exchangerate.section_1.title")}
          description={t("exchangerate.section_1.description")}
        >
          <Tabs
            title={t("exchangerate.section_1.bar_header", {
              period: t(`exchangerate.keys.${SNAPSHOT_TAB[data.active_snapshot]}`),
            })}
            onChange={(index: number) => setData("active_snapshot", index)}
          >
            {SNAPSHOT_TAB.map((key: string) => {
              const sorted_data = sortMulti(bar.data[key], "y", (a: number, b: number) => b - a);
              return (
                <Panel name={t(`exchangerate.keys.${key}`)} key={key}>
                  <Bar
                    className="h-[350px] w-full"
                    unitY="%"
                    enableGridX={false}
                    data={{
                      labels: sorted_data.x,
                      datasets: [
                        {
                          label: t("exchangerate.section_1.bar_header", {
                            period: t(`exchangerate.keys.${SNAPSHOT_TAB[data.active_snapshot]}`),
                          }),
                          data: sorted_data.y,
                          backgroundColor(ctx, options) {
                            return getGreenToRed(ctx.parsed.y);
                          },
                        },
                      ],
                    }}
                  />
                </Panel>
              );
            })}
          </Tabs>
        </Section>

        {/* How is the Ringgit trending? */}
        <Section title={t("exchangerate.section_2.title")}>
          <Tabs title={t("exchangerate.keys.currency0")} onChange={e => setData("active_trend", e)}>
            {TREND_TAB.map(key => (
              <Panel name={t(`exchangerate.keys.${key}`)} key={key}>
                <div className="space-y-12">
                  <Timeseries
                    className="h-[300px] w-full"
                    interval={data.active_trend < 2 ? "day" : "auto"}
                    unitY="%"
                    data={{
                      labels: timeseries.data[key].x,
                      datasets: [
                        {
                          type: "line",
                          data: timeseries.data[key].currency0,
                          label: t("exchangerate.keys.currency0"),
                          borderColor: AKSARA_COLOR.PRIMARY,
                          borderWidth: 1.5,
                          backgroundColor: AKSARA_COLOR.PRIMARY_H,
                          fill: true,
                        },
                      ],
                    }}
                    stats={[
                      {
                        title: t("exchangerate.latest"),
                        value: timeseries_callouts.data.currency0.callout,
                      },
                    ]}
                  />

                  <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    {CURRENCY.map(index => (
                      <Timeseries
                        title={timeseries_callouts.data[index][`country_${lang}`]}
                        className="h-[300px] w-full"
                        interval={data.active_trend < 2 ? "day" : "auto"}
                        prefixY={timeseries_callouts.data[index].tooltip_unit}
                        data={{
                          labels: timeseries.data[key].x,
                          datasets: [
                            {
                              type: "line",
                              data: timeseries.data[key][index],
                              label: timeseries_callouts.data[index][`country_${lang}`],
                              borderColor: shader([
                                timeseries.data[key][index][0],
                                timeseries.data[key][index][timeseries.data[key][index].length - 1],
                              ]).borderColor,
                              borderWidth: 1.5,
                              backgroundColor: shader([
                                timeseries.data[key][index][0],
                                timeseries.data[key][index][timeseries.data[key][index].length - 1],
                              ]).backgroundColor,
                              fill: true,
                            },
                          ],
                        }}
                        stats={[
                          {
                            title: t("exchangerate.latest"),
                            value: timeseries_callouts.data[index].callout,
                          },
                        ]}
                      />
                    ))}
                  </div>
                </div>
              </Panel>
            ))}
          </Tabs>
        </Section>
      </Container>
    </>
  );
};

export default ExchangeRatesDashboard;
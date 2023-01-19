import Slider from "@components/Chart/Slider";
import Chips from "@components/Chips";
import Dropdown from "@components/Dropdown";
import Select from "@components/Dropdown/Select";
import Tabs, { Panel } from "@components/Tabs";
import { OptionType } from "@components/types";
import { useData } from "@hooks/useData";
import { useWatch } from "@hooks/useWatch";
import { get } from "@lib/api";
import { SHORT_LANG, CountryAndStates, AKSARA_COLOR } from "@lib/constants";
import type { ChartDataset } from "chart.js";
import { useTranslation } from "@hooks/useTranslation";
import dynamic from "next/dynamic";
import { FunctionComponent, useCallback, useMemo } from "react";
import { sortMsiaFirst, sortMulti } from "@lib/helpers";

const Bar = dynamic(() => import("@components/Chart/Bar"), { ssr: false });

/**
 * Consumer Prices (CPI) - Inflation Geography Section
 * @overview Status: Live
 */

interface InflationGeographyProps {
  bar: any;
}

const InflationGeography: FunctionComponent<InflationGeographyProps> = ({ bar }) => {
  const { t, i18n } = useTranslation();
  const periods = ["yoy", "mom"];
  const { data, setData } = useData({
    active_state: "mys",
    period_state: 0,
    period_category: 0,
  });

  const sortStateData = useCallback((period: string) => {
    let _data: Record<string, any[]> = {
      x: [],
      y: [],
    };
    let mys_overall = 0;

    Object.keys(bar.data[period]).forEach(state => {
      if (state !== "mys") {
        _data.x.push(state);
        _data.y.push(bar.data[period][state].y[0]);
      } else {
        mys_overall = bar.data[period][state].y[0];
      }
    });

    _data = sortMulti(_data, "y", (a: number, b: number) => b - a);
    _data.x.unshift("mys");
    _data.y.unshift(mys_overall);

    return _data;
  }, []);
  const sortCategoryData = useCallback(
    (period: string) => {
      let _data: Record<string, any[]> = {
        x: bar.data[period][data.active_state].x.slice(1),
        y: bar.data[period][data.active_state].y.slice(1),
      };
      const state_overall = bar.data[period][data.active_state].y[0];

      _data = sortMulti(_data, "y", (a: number, b: number) => b - a);
      _data.x.unshift("overall");
      _data.y.unshift(state_overall);

      return _data;
    },
    [data.active_state]
  );

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
      <div>
        <Tabs
          title={t("consumer_prices.section_1.inflation_by_state")}
          onChange={index => setData("period_state", index)}
        >
          {periods.map(period => (
            <Panel name={t(`consumer_prices.section_1.${period}`)}>
              <Bar
                className="aspect-square w-full lg:h-[600px]"
                layout="horizontal"
                enableGridY={false}
                type="category"
                unitY="%"
                formatX={key => CountryAndStates[key]}
                data={{
                  labels: sortStateData(period).x,
                  datasets: [
                    {
                      label: t("consumer_prices.section_1.inflation_by_state"),
                      data: sortStateData(period).y,
                      backgroundColor(ctx) {
                        return ctx.dataIndex === sortStateData(period).x.length - 1
                          ? "#22C55E80"
                          : AKSARA_COLOR.DIM_H;
                      },
                      hoverBackgroundColor(ctx) {
                        return ctx.dataIndex === sortStateData(period).x.length - 1
                          ? "#22C55E80"
                          : AKSARA_COLOR.DIM;
                      },
                    },
                  ],
                }}
                onClick={label => setData("active_state", label)}
              />
            </Panel>
          ))}
        </Tabs>
      </div>
      <div>
        <Tabs
          title={t("consumer_prices.section_1.inflation_by_category", {
            state: CountryAndStates[data.active_state],
          })}
        >
          {periods.map(period => (
            <Panel name={t(`consumer_prices.section_1.${period}`)}>
              <Bar
                className="aspect-square w-full lg:h-[600px]"
                layout="horizontal"
                enableGridY={false}
                type="category"
                unitY="%"
                formatX={key => t(`consumer_prices.section_1.short_categories.${key}`)}
                data={{
                  labels: sortCategoryData(period).x,
                  datasets: [
                    {
                      label: t("consumer_prices.section_1.inflation_by_category", {
                        state: CountryAndStates[data.active_state],
                      }),
                      data: sortCategoryData(period).y,
                      backgroundColor(ctx) {
                        return ctx.dataIndex === sortCategoryData(period).x.length - 1
                          ? "#22C55E80"
                          : AKSARA_COLOR.DIM_H;
                      },
                      hoverBackgroundColor(ctx) {
                        return ctx.dataIndex === sortCategoryData(period).x.length - 1
                          ? "#22C55E80"
                          : AKSARA_COLOR.DIM;
                      },
                    },
                  ],
                }}
              />
            </Panel>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default InflationGeography;

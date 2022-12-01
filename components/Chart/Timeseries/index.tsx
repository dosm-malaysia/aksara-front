import { FunctionComponent, ReactElement, useMemo, useCallback, ForwardedRef } from "react";
import Tooltip from "@components/Tooltip";
import { default as ChartHeader, ChartHeaderProps } from "@components/Chart/ChartHeader";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineController,
  BarElement,
  PointElement,
  LineElement,
  Tooltip as ChartTooltip,
  TimeScale,
  TimeSeriesScale,
  Legend,
  ChartData,
  ChartTypeRegistry,
  BarController,
} from "chart.js";
import { CrosshairPlugin } from "chartjs-plugin-crosshair";
import AnnotationPlugin from "chartjs-plugin-annotation";

import { Chart } from "react-chartjs-2";
import { numFormat } from "@lib/helpers";
import "chartjs-adapter-luxon";
import { ChartCrosshairOption } from "@lib/types";
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types";

export type Periods =
  | false
  | "auto"
  | "millisecond"
  | "second"
  | "minute"
  | "hour"
  | "day"
  | "week"
  | "month"
  | "quarter"
  | "year";
export interface TimeseriesProps extends ChartHeaderProps {
  className?: string;
  description?: string;
  type?: keyof ChartTypeRegistry;
  data?: ChartData<keyof ChartTypeRegistry, any[], string | number>;
  mode?: "grouped" | "stacked";
  subheader?: ReactElement;
  interval?: Periods;
  round?: Periods;
  unitY?: string;
  gridXValues?: Array<number> | undefined;
  gridYValues?: Array<number> | undefined;
  minY?: number;
  maxY?: number;
  enableRightScale?: boolean;
  enableCallout?: boolean;
  enableCrosshair?: boolean;
  enableLegend?: boolean;
  enableGridX?: boolean;
  enableGridY?: boolean;
  stats?: Array<StatProps> | null;
  _ref?: ForwardedRef<ChartJSOrUndefined<keyof ChartTypeRegistry, any[], unknown>>;
}

const Timeseries: FunctionComponent<TimeseriesProps> = ({
  className = "w-full h-[450px]", // manage CSS here
  menu,
  title,
  description,
  controls,
  interval = "auto",
  unitY,
  round = "day",
  mode = "stacked",
  data = dummy,
  stats,
  state,
  subheader,
  type = "bar",
  enableRightScale = false,
  enableCallout = false,
  enableCrosshair = true,
  enableLegend = false,
  enableGridX = false,
  enableGridY = true,
  maxY,
  _ref,
}) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    BarController,
    PointElement,
    LineElement,
    LineController,
    TimeScale,
    TimeSeriesScale,
    Legend,
    ChartTooltip,
    CrosshairPlugin,
    AnnotationPlugin
  );
  const options = useCallback((): ChartCrosshairOption => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      normalized: true,
      elements: {
        point: {
          borderWidth: 0,
          radius: 0,
          hoverRadius: 2,
        },
      },
      plugins: {
        legend: {
          display: enableLegend,
          position: "chartArea" as const,
          align: "start",
        },
        tooltip: {
          enabled: true,
          bodyFont: {
            family: "Inter",
          },
          mode: "index",
          intersect: false,
          callbacks: {
            label: function (item) {
              console.log(item);
              return `${item.dataset.label} : ${
                item.parsed.y ? numFormat(item.parsed.y, "standard") : "-"
              }`;
            },
          },
          filter: function (tooltipItem) {
            return !!tooltipItem.dataset.label;
          },
        },
        annotation: enableCallout
          ? {
              clip: false,
              common: {
                drawTime: "afterDraw",
              },
              annotations: data.datasets.map((set, index) => {
                const INDEXES = {
                  year: data.labels!.length - 200,
                  quarter: data.labels!.length - 45,
                  month: data.labels!.length - 15,
                  week: data.labels!.length - 4,
                  millisecond: data.labels!.length - 1,
                  second: data.labels!.length - 1,
                  minute: data.labels!.length - 1,
                  hour: data.labels!.length - 1,
                  day: data.labels!.length - 1,
                };
                const xIndex = round && round !== "auto" ? INDEXES[round] : data.labels!.length - 1;
                const yIndex = data.labels!.length - 1;
                return {
                  type: "label",
                  callout: {
                    display: true,
                  },
                  content(ctx, options) {
                    let text = set.label!;
                    if (text.length > 15) text = text.slice(0, 12).concat("...");
                    return text;
                  },
                  font: {
                    family: "Inter",
                    style: "normal",
                    lineHeight: 1,
                    weight: "400",
                    size: 14,
                  },
                  position: {
                    x: "start",
                    y: "start",
                  },
                  xAdjust: 20,
                  xValue: data.labels![xIndex] as string | number,
                  yAdjust: -20,
                  yValue: data.datasets
                    .slice(0, index + 1)
                    .reduce((previous, current) => previous + current.data[yIndex], 0),
                };
              }),
            }
          : false,
        crosshair: enableCrosshair
          ? {
              line: {
                width: 0,
                color: "#000",
                dashPattern: [6, 4],
              },
              zoom: {
                enabled: false,
              },
              sync: {
                enabled: false,
              },
            }
          : false,
      },
      layout: {
        padding: {
          right: enableCallout && round ? 120 : 0,
          top: enableCallout ? 20 : 0,
        },
      },
      scales: {
        x: {
          type: "time",
          time: {
            unit: interval === "auto" ? autoScale : interval,
            round: round === "auto" ? autoRound : round,

            displayFormats: {
              quarter: "MMM",
              month: "MMM",
              week: "dd MMM",
            },
            tooltipFormat: ["year", "month"].includes(interval as string)
              ? { month: "MMM yyyy", year: "yyyy" }[interval as "year" | "month"]
              : "dd MMM yyyy",
          },
          grid: {
            display: enableGridX,
            borderWidth: 1,
            borderDash: [5, 10],
          },
          ticks: {
            major: {
              enabled: true,
            },
            minRotation: 0,
            maxRotation: 0,
            font: {
              family: "Inter",
            },
          },
          stacked: mode === "stacked",
        },
        y: {
          grid: {
            display: enableGridY,
            borderWidth: 1,
            borderDash: [5, 5],
            drawTicks: false,
            drawBorder: false,
            offset: false,
          },
          ticks: {
            padding: 6,
            callback: (value: string | number) => {
              return value && numFormat(value as number).concat(unitY ?? "");
            },
            font: {
              family: "Inter",
            },
          },
          max: maxY,
          stacked: mode === "stacked",
        },
        ...(enableRightScale
          ? {
              y1: {
                position: "right" as const,
                grid: {
                  drawOnChartArea: false,
                  drawTicks: false,
                  drawBorder: false,
                  offset: false,
                },
                ticks: {
                  padding: 6,
                  callback: (value: string | number) => {
                    return numFormat(value as number).concat("%");
                  },
                  font: {
                    family: "Inter",
                  },
                },
                stacked: mode === "stacked",
              },
            }
          : {}),
      },
    };
  }, [data, interval]);

  const autoScale = useMemo(
    () => data.labels && (data.labels.length > 360 ? "month" : "day"),
    [data.labels]
  );
  const autoRound = useMemo(
    () => data.labels && (data.labels.length > 720 ? "week" : "day"),
    [data.labels]
  );

  return (
    <div className="space-y-2">
      <ChartHeader title={title} menu={menu} controls={controls} state={state} />
      {stats && <Stats data={stats}></Stats>}
      {subheader && <div>{subheader}</div>}
      <div className={className}>
        <Chart ref={_ref} data={data} options={options()} type={type} />
      </div>
      {description && <p className="text-sm text-dim">{description}</p>}
    </div>
  );
};
const dummy: ChartData = {
  labels: [1111111111111, 1579478400000], // x-values - must be epoch millis eg. [168231311000, 16856172321, ...] etc
  datasets: [
    // stacked y-values
    {
      type: "line",
      label: "Moving Average (MA)",
      data: [1, 2, 3], // y-values
      borderColor: "red",
    },
    {
      type: "bar",
      label: "Primary",
      data: [4, 5, 6], // y-values
      backgroundColor: "blue",
    },
    {
      type: "bar",
      label: "Booster 1",
      data: [1, 2, 3], // y-values
      backgroundColor: "teal",
    },
    {
      type: "bar",
      label: "Booster 2",
      data: [10, 11, 12], // y-values
      backgroundColor: "green",
    },
  ],
};

/**
 * Stats Component
 */
interface StatsProps {
  data: Array<StatProps>;
  className?: string;
}

type StatProps = {
  title: string;
  value: string;
  tooltip?: string;
};

const Stats: FunctionComponent<StatsProps> = ({ data, className }) => {
  const cols: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
  };
  return (
    <div className={`grid w-full ${cols[data.length] ?? "grid-cols-3"} ${className}`}>
      {data.map(({ title, value, tooltip }: StatProps, index) => (
        <div key={index}>
          <p className="text-sm text-dim">{title}</p>
          {tooltip ? (
            <Tooltip tip={tooltip}>
              {open => (
                <>
                  <h4
                    className="font-medium underline decoration-dashed underline-offset-4"
                    onClick={() => open()}
                  >
                    {value}
                  </h4>
                </>
              )}
            </Tooltip>
          ) : (
            <h4 className="font-medium">{value}</h4>
          )}
        </div>
      ))}
    </div>
  );
};

export default Timeseries;

import { FunctionComponent, useMemo, useRef } from "react";
import { default as ChartHeader, ChartHeaderProps } from "@components/Chart/ChartHeader";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Tooltip as ChartTooltip,
  ChartData,
} from "chart.js";
import { Bar as BarCanvas, getElementAtEvent } from "react-chartjs-2";
import { numFormat } from "@lib/helpers";
import { ChartCrosshairOption } from "@lib/types";
import type { ChartJSOrUndefined } from "react-chartjs-2/dist/types";

interface BarProps extends ChartHeaderProps {
  className?: string;
  layout?: "vertical" | "horizontal";
  data?: ChartData<"bar", any[], string | number>;
  type?: "category" | "linear" | "logarithmic";
  unitX?: string;
  unitY?: string;
  prefixY?: string;
  minY?: number;
  maxY?: number;
  formatX?: (key: string) => string | string[];
  onClick?: (label: string) => void;
  enableLegend?: boolean;
  enableGridX?: boolean;
  enableGridY?: boolean;
  enableStack?: boolean;
  interactive?: boolean;
}

const Bar: FunctionComponent<BarProps> = ({
  className = "w-full h-full", // manage CSS here
  menu,
  title,
  controls,
  state,
  type = "category",
  unitX,
  unitY,
  prefixY,
  layout = "vertical",
  data = dummy,
  formatX,
  onClick,
  enableLegend = false,
  enableStack = false,
  enableGridX = true,
  enableGridY = true,
  minY,
  maxY,
}) => {
  const ref = useRef<ChartJSOrUndefined<"bar", any[], string | number>>();
  const isVertical = useMemo(() => layout === "vertical", [layout]);
  ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, ChartTooltip);

  const display = (value: number, type: "compact" | "standard", precision: number): string => {
    return (prefixY ?? "") + numFormat(value, type, precision) + (unitY ?? "");
  };

  const _data = useMemo<ChartData<"bar", any[], string | number>>(() => {
    // if (!isVertical) return data;
    return {
      labels: data.labels?.slice().reverse(),
      datasets: data.datasets.map(set => ({ ...set, data: set.data.slice().reverse() })),
    };
  }, [data]);

  const options: ChartCrosshairOption<"bar"> = {
    indexAxis: !isVertical ? "y" : "x",
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: enableLegend,
        position: "chartArea" as const,
        align: "start",
      },
      tooltip: {
        bodyFont: {
          family: "Inter",
        },
        callbacks: {
          label: function (item) {
            const tip: Record<typeof layout, string> = {
              vertical:
                item.parsed.y !== undefined || item.parsed.y !== null
                  ? display(item.parsed.y, "standard", 2)
                  : "-",
              horizontal:
                item.parsed.x !== undefined || item.parsed.x !== null
                  ? display(item.parsed.x, "standard", 2)
                  : "-",
            };
            return `${item.dataset.label} : ${tip[layout]}`;
          },
          title(item) {
            return formatX ? formatX(item[0].label) : item[0].label;
          },
        },
      },
      crosshair: false,
      annotation: false,
    },
    scales: {
      x: {
        type: isVertical ? type : "linear",
        grid: {
          display: enableGridX,
          borderWidth: 1,
          borderDash: [5, 10],
          drawTicks: true,
          drawBorder: true,
        },
        ticks: {
          font: {
            family: "Inter",
          },
          padding: 6,
          callback: function (value: string | number) {
            return isVertical
              ? this.getLabelForValue(value as number).concat(unitX ?? "")
              : display(value as number, "compact", 1);
          },
        },
        stacked: enableStack,
      },
      y: {
        reverse: !isVertical,
        grid: {
          display: enableGridY,
          borderWidth: 1,
          drawTicks: false,
          drawBorder: false,
          offset: false,
          borderDash(ctx) {
            if (ctx.tick.value === 0) return [0, 0];
            return [5, 5];
          },
          lineWidth(ctx) {
            if (ctx.tick.value === 0) return 2;
            return 1;
          },
        },
        ticks: {
          font: {
            family: "Inter",
          },
          padding: 6,
          callback: function (value: string | number) {
            if (formatX)
              return formatX(
                isVertical
                  ? display(value as number, "compact", 1)
                  : this.getLabelForValue(value as number).concat(unitX ?? "")
              );
            return isVertical
              ? display(value as number, "compact", 1)
              : this.getLabelForValue(value as number).concat(unitX ?? "");
          },
        },
        min: minY,
        max: maxY,
        stacked: enableStack,
      },
    },
  };
  return (
    <div className="space-y-4">
      <ChartHeader title={title} menu={menu} controls={controls} state={state} />
      <div className={className}>
        <BarCanvas
          ref={ref}
          onClick={event => {
            if (ref?.current) {
              const element = getElementAtEvent(ref.current, event);
              onClick && element.length && onClick(_data?.labels![element[0].index].toString());
            }
          }}
          data={_data}
          options={options}
        />
      </div>
    </div>
  );
};

const dummy = {
  labels: ["0-4", "5-10", "11-14"], // x-values
  datasets: [
    // grouped y-values
    {
      label: "Moving Average (MA)",
      data: [1, 2, 3], // y-values
      fill: true,
      backgroundColor: "#000",
    },
    {
      label: "Primary",
      data: [4, 1, 7], // y-values
      fill: true,
      backgroundColor: "#a4a4a4",
      stack: "primary",
    },
  ],
};

export default Bar;

import { FunctionComponent, useMemo } from "react";
import { default as ChartHeader, ChartHeaderProps } from "@components/Chart/ChartHeader";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip as ChartTooltip,
  ChartData,
} from "chart.js";
import { Scatter as ScatterCanvas } from "react-chartjs-2";
import { numFormat } from "@lib/helpers";
import { ChartCrosshairOption } from "@lib/types";
import { AKSARA_COLOR } from "@lib/constants";

interface ScatterProps extends ChartHeaderProps {
  className?: string;
  data?: ChartData<"scatter", any[], string | number>;
  unitX?: string;
  unitY?: string;
  prefixY?: string;
  minX?: number;
  minY?: number;
  maxY?: number;
  titleX?: string;
  titleY?: string;
  enableLegend?: boolean;
  enableGridX?: boolean;
  enableGridY?: boolean;
}

const Scatter: FunctionComponent<ScatterProps> = ({
  className = "w-full h-full", // manage CSS here
  menu,
  title,
  controls,
  state,
  unitX,
  unitY,
  prefixY,
  data = dummy,
  enableLegend = false,
  enableGridX = true,
  enableGridY = true,
  titleX,
  titleY,
  minX,
  minY,
  maxY,
}) => {
  ChartJS.register(CategoryScale, LinearScale, PointElement, ChartTooltip);

  const display = (value: number, type: "compact" | "standard", precision: number): string => {
    return (prefixY ?? "") + numFormat(value, type, precision) + (unitY ?? "");
  };

  const titleConfig = (axis: string | undefined) => ({
    display: Boolean(axis),
    text: axis,
    color: AKSARA_COLOR.BLACK,
    font: {
      size: 14,
      family: "Inter",
      weight: "500",
    },
  });

  const options: ChartCrosshairOption<"scatter"> = {
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
            return `${item.dataset.label} : [${display(item.parsed.x, "compact", 1)}, ${display(
              item.parsed.y,
              "compact",
              1
            )}]`;
          },
        },
      },
      crosshair: false,
      annotation: false,
    },
    scales: {
      x: {
        title: titleConfig(titleX),
        type: "linear",
        grid: {
          display: enableGridX,
          borderWidth: 1,
          drawTicks: true,
          drawBorder: true,
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
            return display(value as number, "compact", 1);
          },
        },
        min: minX,
      },
      y: {
        title: titleConfig(titleY),
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
            return display(value as number, "compact", 1).concat(unitX ?? "");
          },
        },
        min: minY,
        max: maxY,
      },
    },
  };
  return (
    <div className="space-y-4">
      <ChartHeader title={title} menu={menu} controls={controls} state={state} />
      <div className={className}>
        <ScatterCanvas data={data} options={options} />
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

export default Scatter;

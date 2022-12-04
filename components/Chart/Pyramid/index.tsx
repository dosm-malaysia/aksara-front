import { FunctionComponent } from "react";
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
import { Bar as BarCanvas } from "react-chartjs-2";
import { numFormat } from "@lib/helpers";
import { BarCrosshairOption } from "@lib/types";

interface PyramidProps extends ChartHeaderProps {
  className?: string;
  data?: ChartData<"bar", any[], string | number>;
  unitX?: string;
  unitY?: string;
  minX?: number;
  maxX?: number;
  enableLegend?: boolean;
  enableGridX?: boolean;
  enableGridY?: boolean;
}

const Bar: FunctionComponent<PyramidProps> = ({
  className = "w-full h-full", // manage CSS here
  menu,
  title,
  controls,
  state,
  unitX,
  unitY,
  data = dummy,
  enableLegend = false,
  enableGridX = true,
  enableGridY = false,
  minX,
  maxX,
}) => {
  ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, ChartTooltip);

  const options: BarCrosshairOption = {
    indexAxis: "y",
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
            return `${item.dataset.label} : ${
              item.parsed.y ? numFormat(Math.abs(item.parsed.y), "standard") : "-"
            }`;
          },
        },
      },
      crosshair: false,
    },
    scales: {
      x: {
        type: "linear",
        grid: {
          display: enableGridX,
          borderWidth: 1,
          borderDash: [5, 10],
        },
        ticks: {
          font: {
            family: "Inter",
          },
          padding: 6,
          callback: function (value: string | number) {
            return this.getLabelForValue(Math.abs(value as number)).concat(unitX ?? "");
          },
        },
        stacked: true,
        min: minX,
        max: maxX,
      },
      y: {
        reverse: true,
        grid: {
          display: enableGridY,
          borderWidth: 1,
          borderDash: [5, 5],
          drawTicks: false,
          drawBorder: false,
          offset: false,
        },
        ticks: {
          font: {
            family: "Inter",
          },
          padding: 6,
          callback: function (value: string | number) {
            return numFormat(value as number).concat(unitY ?? "");
          },
        },
        beginAtZero: true,
        stacked: true,
      },
    },
  };
  return (
    <div>
      <ChartHeader title={title} menu={menu} controls={controls} state={state} />
      <div className={className}>
        <BarCanvas data={data} options={options} />
      </div>
    </div>
  );
};

const dummy = {
  labels: ["0-4", "5-10", "11-14", "15-19", "20-24", "25-29", "30-34", "35-39"], // x-values
  datasets: [
    // grouped y-values
    {
      label: "Male",
      data: [1, 2, 3, 4, 5, 6, 7, 8], // y-values
      fill: true,
      backgroundColor: "#000",
    },
    {
      label: "Female",
      data: [-1, -2, -3, -4, -5, -6, -7, -8], // y-values
      fill: true,
      backgroundColor: "#a4a4a4",
    },
  ],
};

export default Bar;

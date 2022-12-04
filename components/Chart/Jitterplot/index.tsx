import React, { FunctionComponent } from "react";
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip } from "chart.js";
import type { ChartOptions, ChartData } from "chart.js";
import { Scatter } from "react-chartjs-2";
import ChartHeader, { ChartHeaderProps } from "../ChartHeader";

/** ------------------------GROUPED------------------------------------- */

type JitterDatum = {
  x: number;
  y: number;
  id: string;
};
type JitterData = {
  key: string;
  data: JitterDatum[];
};

interface JitterplotsProps extends Pick<ChartHeaderProps, "title"> {
  className?: string;
  data?: Array<JitterData>;
}

const Jitterplots: FunctionComponent<JitterplotsProps> = ({ title, data = dummies, className }) => {
  return (
    <div>
      <ChartHeader title={title} className="z-10" />
      <div className={["space-y-2 pt-3", className].join(" ")}>
        {data.map((set: JitterData) => (
          <Jitterplot data={set} />
        ))}
      </div>
    </div>
  );
};

/** -----------------------INDIVIDUAL----------------------------------- */
interface JitterplotProps extends ChartHeaderProps {
  data: JitterData;
}

const Jitterplot: FunctionComponent<JitterplotProps> = ({ data }) => {
  ChartJS.register(LinearScale, PointElement, LineElement, Tooltip);
  const options: ChartOptions<"scatter"> = {
    plugins: {
      legend: {
        display: false,
        position: "chartArea" as const,
        align: "start",
      },
      tooltip: {
        displayColors: false,
        bodyFont: {
          family: "Inter",
          size: 14,
        },

        callbacks: {
          label: function (item: any) {
            return `${item.raw.id}`;
          },
        },
      },
    },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        display: false,
      },
      y: {
        display: false,
        beginAtZero: true,
      },
    },
  };
  return (
    <>
      <div className="grid w-full grid-cols-1 items-center gap-1 lg:grid-cols-5">
        <p className="z-10 bg-white">{data.key}</p>
        <div className="col-span-1 lg:col-span-4">
          <Scatter
            className="h-10 rounded-full border bg-outline/20 px-4"
            options={options}
            data={{ datasets: [{ data: data.data }] }}
          />
        </div>
      </div>
    </>
  );
};

export default Jitterplots;

const dummy: JitterDatum[] = Array(14)
  .fill(0)
  .map(
    (): JitterDatum => ({
      x: Math.floor(Math.random() * 100 + 0),
      y: Math.floor(Math.random() * 100 + 0),
      id: "Seremban",
    })
  );

const dummy_keys = ["Land area", "Population Density", "Household income", "Access to electricity"];
const dummies: JitterData[] = Array(dummy_keys.length)
  .fill(0)
  .map((_, index) => ({ key: dummy_keys[index], data: dummy }));

type jitter_sample = [
  {
    key: "metric_1";
    data: [
      {
        id: string;
        x: number;
        y: number;
      }
      // ...
    ];
  }
];

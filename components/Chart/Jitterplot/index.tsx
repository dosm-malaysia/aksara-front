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
      <ChartHeader title={title} />
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
        bodyFont: {
          family: "Inter",
        },
        callbacks: {
          label: function (item: any) {
            return `${item.raw.id} : ${item.parsed.y}`;
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
      <div className="grid h-10 w-full grid-cols-5 items-center gap-4">
        <p>{data.key}</p>
        <div className="col-span-4">
          <Scatter
            className=" h-10 rounded-full border px-4"
            options={options}
            data={{
              datasets: [
                {
                  data: data.data,
                },
              ],
            }}
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
      id: "mlk",
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
        id: string; // state code: mlk, sgr etc
        x: number;
        y: number;
      }
      // ...
    ];
  }
];

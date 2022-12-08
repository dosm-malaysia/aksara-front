import type { ChartOptions, ScriptableContext } from "chart.js";
import { FunctionComponent, useCallback } from "react";
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip } from "chart.js";
import { Bubble } from "react-chartjs-2";
import { default as ChartHeader, ChartHeaderProps } from "../ChartHeader";
import { CountryAndStates } from "@lib/constants";

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
  active?: string;
  actives?: string[];
}

const Jitterplots: FunctionComponent<JitterplotsProps> = ({
  title,
  data = dummies,
  className,
  active = "",
  actives = [],
}) => {
  return (
    <div>
      <ChartHeader title={title} className="z-10" />
      <div className={["space-y-2 pt-3", className].join(" ")}>
        {data.map((set: JitterData) => (
          <Jitterplot data={set} active={active} actives={actives} />
        ))}
      </div>
    </div>
  );
};

/** -----------------------INDIVIDUAL----------------------------------- */
interface JitterplotProps extends ChartHeaderProps {
  data: JitterData;
  active: string;
  actives: string[];
}

const Jitterplot: FunctionComponent<JitterplotProps> = ({ data, active, actives }) => {
  ChartJS.register(LinearScale, PointElement, LineElement, Tooltip);
  const DEFAULT_STYLE = {
    backgroundColor: "#0000001a",
    radius: 4,
    hoverRadius: 1,
  };
  const options: ChartOptions<"bubble"> = {
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

  const activePoints = useCallback<
    (ctx: ScriptableContext<"bubble">) => {
      backgroundColor: string;
      radius: number;
      hoverRadius: number;
    }
  >(
    ({ raw }: ScriptableContext<"bubble">) => {
      if ((raw as JitterDatum).id === active)
        return { backgroundColor: "#0F172A", radius: 6, hoverRadius: 1 };

      const index = actives.indexOf((raw as JitterDatum).id);
      if (index === -1) return DEFAULT_STYLE;

      switch (index) {
        case 0:
          return { backgroundColor: "#DC2626", radius: 6, hoverRadius: 1 };
        case 1:
          return { backgroundColor: "#2563EB", radius: 6, hoverRadius: 1 };
        case 2:
          return { backgroundColor: "#FBBF24", radius: 6, hoverRadius: 1 };
        default:
          return DEFAULT_STYLE;
      }
    },
    [actives]
  );
  return (
    <>
      <div className="grid w-full grid-cols-1 items-center gap-1 lg:grid-cols-5">
        <p className="z-10 bg-white">{data.key}</p>
        <div className="col-span-1 lg:col-span-4">
          <Bubble
            className="h-10 rounded-full border bg-outline/20 px-4"
            options={options}
            data={{
              datasets: [
                {
                  data: data.data,
                  borderWidth: 0,
                  backgroundColor(ctx) {
                    return activePoints(ctx).backgroundColor;
                  },
                  radius(ctx) {
                    return activePoints(ctx).radius;
                  },
                  hoverRadius(ctx) {
                    return activePoints(ctx).hoverRadius;
                  },
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

const dummy: JitterDatum[] = Array(Object.keys(CountryAndStates).length)
  .fill(0)
  .map(
    (_, index): JitterDatum => ({
      x: Math.floor(Math.random() * 100 + 0),
      y: Math.floor(Math.random() * 100 + 0),
      id: Object.values(CountryAndStates)[index],
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
        id: string; // Pahang
        x: number; // 0.2
        y: number; // 1.3
      }
      // ...
    ];
  }
];

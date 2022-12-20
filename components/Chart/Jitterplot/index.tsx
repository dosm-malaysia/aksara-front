import type { ChartOptions, ScriptableContext } from "chart.js";
import { FunctionComponent, useCallback } from "react";
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip } from "chart.js";
import { Bubble } from "react-chartjs-2";
import { default as ChartHeader, ChartHeaderProps } from "../ChartHeader";
import { AKSARA_COLOR, CountryAndStates } from "@lib/constants";

/** ------------------------GROUPED------------------------------------- */

type JitterDatum = {
  x: number;
  y: number;
  id: string;
};
export type JitterData = {
  key: string;
  data: JitterDatum[];
};

interface JitterplotsProps extends Pick<ChartHeaderProps, "title"> {
  className?: string;
  data?: Array<JitterData>;
  active?: string;
  actives?: string[];
  format?: (key: string) => string;
}

const Jitterplots: FunctionComponent<JitterplotsProps> = ({
  title,
  data = dummies,
  className,
  active = "",
  actives = [],
  format,
}) => {
  return (
    <div>
      <ChartHeader title={title} className="z-10" />
      <div className={["space-y-2 pt-3", className].join(" ")}>
        {data.map((set: JitterData, index: number) => (
          <Jitterplot key={index} data={set} active={active} actives={actives} format={format} />
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
  format?: (key: string) => string;
}

const Jitterplot: FunctionComponent<JitterplotProps> = ({ data, active, actives, format }) => {
  ChartJS.register(LinearScale, PointElement, LineElement, Tooltip);
  const DEFAULT_STYLE = {
    backgroundColor: AKSARA_COLOR.BLACK_H,
    // backgroundColor: "#0F172A0D",
    radius: 5,
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
        external: externalTooltipHandler,
        position: "nearest",
        displayColors: false,
        enabled: false,
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
      if (active.toLowerCase().includes((raw as JitterDatum).id.toLowerCase()))
        return { backgroundColor: AKSARA_COLOR.BLACK, radius: 6, hoverRadius: 1 };

      const index = actives.findIndex(item =>
        item.toLowerCase().includes((raw as JitterDatum).id.toLowerCase())
      );
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
        <p className="z-10 bg-white">{format ? format(data.key) : data.key}</p>
        <div className="col-span-1 overflow-visible lg:col-span-4">
          <Bubble
            className="h-10 overflow-visible rounded-full border bg-outline/20 px-4"
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

///

const getOrCreateTooltip = (chart: any) => {
  let tooltipEl = chart.canvas.parentNode.querySelector("div");

  if (!tooltipEl) {
    tooltipEl = document.createElement("div");
    tooltipEl.style.background = "rgba(0, 0, 0, 0.7)";
    tooltipEl.style.borderRadius = "3px";
    tooltipEl.style.color = "white";
    tooltipEl.style.opacity = 1;
    tooltipEl.style.pointerEvents = "none";
    tooltipEl.style.position = "absolute";
    tooltipEl.style.transform = "translate(-50%, 0)";
    tooltipEl.style.transition = "all .1s ease";
    tooltipEl.style.zIndex = 20;
    tooltipEl.style.width = "max-content";

    // const ul = document.createElement("ul");
    // ul.style.margin = "0px";
    const table = document.createElement("table");
    table.style.margin = "0px";

    tooltipEl.appendChild(table);
    chart.canvas.parentNode.appendChild(tooltipEl);
  }

  return tooltipEl;
};

const externalTooltipHandler = (context: { chart: any; tooltip: any }) => {
  // Tooltip Element
  const { chart, tooltip } = context;
  const tooltipEl = getOrCreateTooltip(chart);

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  if (tooltip.body) {
    const titleLines = tooltip.title || [];
    const bodyLines = tooltip.body.map((b: { lines: any }) => b.lines);

    const tableHead = document.createElement("thead");

    titleLines.forEach((title: string) => {
      const tr = document.createElement("tr");
      tr.style.borderWidth = "0";

      const th = document.createElement("th");
      th.style.borderWidth = "0";
      const text = document.createTextNode(title);

      th.appendChild(text);
      tr.appendChild(th);
      tableHead.appendChild(tr);
    });

    const tableBody = document.createElement("tbody");

    if (bodyLines.length > 5) {
      for (let i = 0; i < 5; i++) {
        const tr = document.createElement("tr");
        tr.style.backgroundColor = "inherit";
        tr.style.borderWidth = "0";

        const td = document.createElement("td");
        td.style.borderWidth = "0";
        td.style.fontSize = "14px";

        const text = document.createTextNode(bodyLines[i]);

        td.appendChild(text);
        tr.appendChild(td);
        tableBody.appendChild(tr);
      }

      const trExtra = document.createElement("tr");
      trExtra.style.backgroundColor = "inherit";
      trExtra.style.borderWidth = "0";
      const tdExtra = document.createElement("td");
      tdExtra.style.borderWidth = "0";
      tdExtra.style.fontSize = "14px";
      const textExtra = document.createTextNode(`and ${bodyLines.length - 5} more.`);
      tdExtra.appendChild(textExtra);
      trExtra.appendChild(tdExtra);
      tableBody.appendChild(trExtra);
    } else {
      bodyLines.forEach((body: string, i: string | number) => {
        const colors = tooltip.labelColors[i];

        const tr = document.createElement("tr");
        tr.style.backgroundColor = "inherit";
        tr.style.borderWidth = "0";

        const td = document.createElement("td");
        td.style.borderWidth = "0";
        td.style.fontSize = "14px";

        const text = document.createTextNode(body);
        td.appendChild(text);
        tr.appendChild(td);
        tableBody.appendChild(tr);
      });
    }

    const tableRoot = tooltipEl.querySelector("table");

    // Remove old children
    while (tableRoot.firstChild) {
      tableRoot.firstChild.remove();
    }

    // Add new children
    tableRoot.appendChild(tableHead);
    tableRoot.appendChild(tableBody);

    // ulRoot.appendChild(tableHead);
    // tableRoot.appendChild(tableBody);
  }

  const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

  // Display, position, and set styles for font
  tooltipEl.style.opacity = 1;
  tooltipEl.style.left = positionX + tooltip.caretX + "px";
  tooltipEl.style.top = positionY + tooltip.caretY + "px";
  tooltipEl.style.font = tooltip.options.bodyFont.string;
  tooltipEl.style.padding = tooltip.options.padding + "px " + tooltip.options.padding + "px";
};

import ReactParser from "react-html-parser";

const parseToken = (text: string, charts: Array<any>) => {
  let pattern = /({{)(.*?)(}})/g;
  let tokens = text.match(pattern);

  return ReactParser(text, {
    transform: (node: { type: string; data: string; children: any }) => {
      console.log(node.children);
      if (node.children && node.children.length > 0 && tokens?.includes(node.children[0].data)) {
        let tokened: string = node.children[0].data.replace(/{|}/g, "").trim();

        return replaceToken(tokened);
      }
    },
  });
};

const replaceToken = (token: string) => {
  let chart = article.charts.find((chart: { token: string }) => chart.token === token);

  console.log(chart.json);
  switch (chart.type) {
    case "pie":
      return <BarChart data={chart.json}></BarChart>;
    default:
    case "jitterplot":
      return (
        <Jitterplot
          data={chart.json as IJitterplotData[]}
          label="the jitterplot is on the right"
        ></Jitterplot>
      );
      break;
  }
};

export const useChartParser = (html: string) => {
  return {};
};

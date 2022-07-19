import ReactParser from "react-html-parser";

const parsedArticle = (text: string, charts: Array<any>) => {
  let pattern = /({{)(.*?)(}})/g;
  let tokens = text.match(pattern);

  return ReactParser(text, {
    transform: (node: { type: string; data: string; children: any }, index: number) => {
      if (node.children && node.children.length > 0 && tokens?.includes(node.children[0].data)) {
        let tokened: string = node.children[0].data.replace(/{|}/g, "").trim();
        return parseToken(tokened, charts, index);
      }
    },
  });
};

const parseToken = (token: string, charts: Array<any>, key: number) => {
  let {
    chart: { type },
  } = charts.find((chart: { chart: { token: string } }) => chart.chart.token === token);

  switch (type) {
    case "bar":
      return (
        <div key={key} className="bg-yellow-500">
          [Bar chart goes here]
        </div>
      );
    case "line":
      return (
        <div key={key} className="bg-yellow-500">
          [Line chart goes here]
        </div>
      );
    case "bar-line":
      return (
        <div key={key} className="bg-yellow-500">
          [Bar-Line chart goes here]
        </div>
      );
    case "pie":
      return (
        <div key={key} className="bg-yellow-500">
          [Pie chart goes here]
        </div>
      );
    case "jitterplot":
      return (
        <div key={key} className="bg-yellow-500">
          [Jitterplot goes here]
        </div>
      );
    case "pyramid":
      return (
        <div key={key} className="bg-yellow-500">
          [Pyramid goes here]
        </div>
      );
    case "choropleth":
      return (
        <div key={key} className="bg-yellow-500">
          [Choropleth goes here]
        </div>
      );
    case "waffle":
      return (
        <div key={key} className="bg-yellow-500">
          [Choropleth goes here]
        </div>
      );
    default:
      return (
        <div key={key} className="bg-yellow-500">
          [Empty chart]
        </div>
      );
  }
};

export const useChartParser = (text: string, charts: Array<any>) => {
  return {
    content: parsedArticle(text, charts),
  };
};

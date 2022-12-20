import type { NextApiRequest, NextApiResponse } from "next";
import mixpanelConfig from "@config/mixpanel";
import axios, { AxiosRequestConfig } from "axios";

type MixpanelSnapshotParams = {
  project_id: string | number;
  script: string;
};

type AggregateParams = {
  type: "dashboard" | "catalogue";
};

// TOP EVENT PROPVAL + AGGREGATE EVENT PROPVAL
const url: string = "https://mixpanel.com/api/2.0/jql";

// const scripts = {
//   snapshot: `function main() {
//         return Events({
//           from_date: "2022-12-18",
//           to_date: "2022-12-19",
//           event_selectors: [
//             { event: 'file_download', selector: 'properties["type"] == "file"' },
//           ]
//         })
//         .groupBy(['properties.id', 'properties.name_en', 'properties.name_bm'], mixpanel.reducer.count())
//         .sortDesc('value')
//         .applyGroupLimits([5, 1, 1], 5)
//       }`,
//   snapshot1: `function main() {
//         return Events({
//           from_date: "2022-12-18",
//           to_date: "2022-12-19",
//           event_selectors: [
//             { event: 'file_download', selector: 'properties["type"] == "image"', label: 'Graphic Download' },
//             { event: 'file_download', selector: 'properties["type"] == "file"', label: 'File Download' },
//           ]
//         })
//         .groupBy(['type'], function(counts, events) {
//             var count = events.length;
//             for (var i = 0; i < counts.length; i++) {
//                 count += counts[i].hello;
//             }

//             return {
//                 hello: count,
//                 world: 2
//             }

//         // .groupBy([mixpanel.numeric_bucket( {bucket_size: 86400 * 1000})],
//         //      mixpanel.reducer.count());
//       }`,
//   new_snapshot: `function main() {
//         return Events({
//           from_date: "2022-12-04",
//           to_date: "2022-12-10",
//           event_selectors: [
//             { event: 'file_download', selector },
//           ]
//         })
//         .groupBy(['properties.id', 'properties.name'], mixpanel.reducer.count())
//         .reduce(mixpanel.reducer.top(5))
//         .sortDesc('value')
//       }`,
// };

type ResultItem = {
  key: [string, string, string];
  value: number;
};

const script = (type: "dashboard" | "catalogue") => {
  switch (type) {
    case "dashboard":
      return `function main() {
            return Events({
              from_date: "2022-12-18",
              to_date: "2022-12-20",
              event_selectors: [
                { event: 'page_view', selector: 'properties["type"] == "${type}"' },
              ]
            })
            .groupBy(['properties.id', 'properties.route'], mixpanel.reducer.count())
            .sortDesc('value')
            .applyGroupLimits([5, 1], 5)
        }`;

    case "catalogue":
      return `function main() {
            return Events({
              from_date: "2022-12-18",
              to_date: "2022-12-20",
              event_selectors: [
                { event: 'page_view', selector: 'properties["type"] == "${type}"' },
              ]
            })
            .groupBy(['properties.id', 'properties.name_en', 'properties.name_bm'], mixpanel.reducer.count())
            .sortDesc('value')
            .applyGroupLimits([5, 1, 1], 5)
        }`;
  }
};

const config: AxiosRequestConfig = {
  auth: { username: mixpanelConfig.user, password: mixpanelConfig.secret },
};

const GetEventProperty = async (req: NextApiRequest, res: NextApiResponse) => {
  const { type } = req.query as AggregateParams;

  if (!type || !["dashboard", "catalogue"].includes(type))
    return res.status(422).send("Error: Incorrect 'type' value.");

  const params: MixpanelSnapshotParams = {
    project_id: mixpanelConfig.id,
    script: script(type),
  };

  try {
    const { data } = await axios.get(url, { params: params, ...config });

    if (type === "catalogue") {
      const result = data.map((item: ResultItem) => ({
        id: item.key[0],
        name: {
          "en-GB": item.key[1],
          "ms-MY": item.key[2],
        },
        value: item.value,
      }));

      return res.send(result);
    } else if (type === "dashboard") {
      const result: ResultItem[] = data.map((item: ResultItem) => ({
        id: item.key[0],
        route: item.key[1],
        value: item.value,
      }));
      return res.send(result);
    }
  } catch (err) {
    console.log(err);
    return res.send("error: " + err);
  }
};

export default GetEventProperty;

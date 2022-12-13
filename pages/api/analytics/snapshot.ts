import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import mixpanelConfig from "@config/mixpanel";
import axios, { AxiosRequestConfig } from "axios";
import { DateTime } from "luxon";
import type { EventType } from "@lib/types";

type MixpanelSnapshotParams = {
  project_id: string | number;
  script: string;
};

type AggregateParams = {
  script: string;
};

// TOP EVENT PROPVAL + AGGREGATE EVENT PROPVAL

const url: string = "https://mixpanel.com/api/2.0/jql";
// { event: 'file_download', selector: '["csv", "parquet", "svg", "png"] in properties["$ext"]', label: "Valid Downloads" }
const scripts = {
  snapshot: `function main() {
        return Events({
          from_date: "2022-12-04",
          to_date: "2022-12-10",
          event_selectors: [
            { event: 'file_download' },
          ]
        })
        .groupBy(['type'], function(counts, events) {
            var count = events.length;
            for (var i = 0; i < counts.length; i++) {
                count += counts[i].hello;
            }

            return {
                hello: count,
                world: 2
            }
        })
        
      }`,
  new_snapshot: `function main() {
        return Events({
          from_date: "2022-12-04",
          to_date: "2022-12-10",
          event_selectors: [
            { event: 'file_download', selector },
          ]
        })
        .groupBy(['properties.id', 'properties.name'], mixpanel.reducer.count())
        .reduce(mixpanel.reducer.top(5))
        .sortDesc('value')
      }`,
};

const config: AxiosRequestConfig = {
  auth: { username: mixpanelConfig.user, password: mixpanelConfig.secret },
};

const GetEventProperty = async (req: NextApiRequest, res: NextApiResponse) => {
  const { script } = req.query as AggregateParams;

  //   const today = DateTime.now().toISODate();

  const params: MixpanelSnapshotParams = {
    project_id: mixpanelConfig.id,
    script: scripts.snapshot,
  };

  try {
    const { data } = await axios.get(url, { params: params, ...config });
    // console.log(data.data.values);

    // const response = Object.entries(data.data.values).map(([key, entries]) => [
    //   key,
    //   Object.values(entries as Record<string, number>).reduce((curr, value) => curr + value, 0),
    // ]);

    return res.send({
      data: data,
    });
  } catch (err) {
    console.log(err);
    return res.send("error: " + err);
  }
};

export default GetEventProperty;

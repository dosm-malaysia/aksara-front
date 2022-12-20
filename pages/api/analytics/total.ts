import type { NextApiRequest, NextApiResponse } from "next";
import mixpanelConfig from "@config/mixpanel";
import axios, { AxiosRequestConfig } from "axios";

type MixpanelSnapshotParams = {
  project_id: string | number;
  script: string;
};
// TOP EVENT PROPVAL + AGGREGATE EVENT PROPVAL
const url: string = "https://mixpanel.com/api/2.0/jql";

const script = () => {
  return `function main() {
            return Events({
              from_date: "2022-12-18",
              to_date: "2022-12-20",
              event_selectors: [
                { event: 'page_view' },
                { event: 'file_download' },
              ]
            })
            .groupBy(['name'], mixpanel.reducer.count())
        }`;
};

const config: AxiosRequestConfig = {
  auth: { username: mixpanelConfig.user, password: mixpanelConfig.secret },
};

const GetEventProperty = async (req: NextApiRequest, res: NextApiResponse) => {
  const params: MixpanelSnapshotParams = {
    project_id: mixpanelConfig.id,
    script: script(),
  };

  try {
    const { data } = await axios.get(url, { params: params, ...config });

    const result = Object.fromEntries(data.map((item: any) => [item.key[0], item.value]));
    return res.send(result);
  } catch (err) {
    console.log(err);
    return res.send("error: " + err);
  }
};

export default GetEventProperty;

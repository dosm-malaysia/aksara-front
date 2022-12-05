import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import mixpanelConfig from "@config/mixpanel";
import axios, { AxiosRequestConfig } from "axios";
import { DateTime } from "luxon";
import type { EventType } from "@lib/types";

type MixpanelAggregateParams = {
  project_id: string | number;
  event: EventType;
  name: string;
  values: string[];
  type: "general" | "unique" | "average"; // general
  unit: "minute" | "hour" | "day" | "week" | "month"; // month
  from_date: string; // default: 20 Dec
  to_date: string; // default: today
};

type AggregateParams = {
  event: EventType;
  id: string;
};

const url: string = "https://mixpanel.com/api/2.0/events/properties";
const config: AxiosRequestConfig = {
  auth: { username: mixpanelConfig.user, password: mixpanelConfig.secret },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { event, id } = req.query as AggregateParams;
  const today = DateTime.now().toISODate();

  const params: MixpanelAggregateParams = {
    project_id: mixpanelConfig.id,
    event: event,
    name: "uid",
    values: [id],
    type: "general",
    unit: "month",
    from_date: "2022-12-04",
    to_date: today,
  };

  try {
    const { data } = await axios.get(url, { params: params, ...config });

    const response = Object.entries(data.data.values).map(([key, entries]) => [
      key,
      Object.values(entries as Record<string, number>).reduce((curr, value) => curr + value, 0),
    ]);

    return res.send({
      download_count: Object.fromEntries(response),
    });
  } catch (err) {
    console.log(err);
    return res.send("error: " + err);
  }
}

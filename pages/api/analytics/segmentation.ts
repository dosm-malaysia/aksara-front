import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import mixpanelConfig from "@config/mixpanel";
import axios, { AxiosRequestConfig } from "axios";
import { DateTime } from "luxon";
import type { MixpanelBase, EventType } from "@lib/types";

/**
 * @todo Replace current /api/event-property with the segmentation query - https://developer.mixpanel.com/reference/segmentation-query
 */
type MixpanelAggregateParams = MixpanelBase & {
  on: string;
  where: string;
  type: "general" | "unique" | "average"; // general
  unit: "minute" | "hour" | "day" | "week" | "month"; // month
  from_date: string; // default: 20 Dec
  to_date: string; // default: today
};

type AggregateParams = {
  event: EventType;
  segment: "ext" | "id" | "uid" | "name";
  key: string;
  value: string;
  start?: string;
  end?: string;
};

const url: string = "https://mixpanel.com/api/2.0/segmentation";
const config: AxiosRequestConfig = {
  auth: { username: mixpanelConfig.user, password: mixpanelConfig.secret },
};

const GetEventProperty = async (req: NextApiRequest, res: NextApiResponse) => {
  const { event, segment, key, value, start, end } = req.query as AggregateParams;

  if (!event || !segment || !key || !value)
    return res
      .status(422)
      .send("Error: Missing required params. Require: event, segment, key, value");

  const today = DateTime.now().toISODate();
  const params: MixpanelAggregateParams = {
    project_id: mixpanelConfig.id,
    event: event,
    on: `properties["${segment}"]`,
    where: `properties["${key}"] in ${value}`,
    type: "general",
    unit: "month",
    from_date: start ?? "2022-12-04",
    to_date: end ?? today,
  };
  try {
    const { data } = await axios.get(url, { params: params, ...config });
    const response = Object.entries(data.data.values).map(([key, entries]) => [
      key,
      Object.values(entries as Record<string, number>).reduce((curr, value) => curr + value, 0),
    ]);
    return res.send({
      data: Object.fromEntries(response),
    });
  } catch (err) {
    return res.status(500).send("error: " + err);
  }
};

export default GetEventProperty;

import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { google } from "googleapis";
import config from "@config/google";

type RevalidateData = {
  revalidated: boolean;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RevalidateData | string>
) {
  //   if (req.headers.authorization !== `Bearer ${process.env.REVALIDATE_TOKEN}`) {
  //     return res.status(401).json({ revalidated: false, message: "Invalid bearer token" });
  //   }

  //   const jwt = new google.auth.JWT(
  //     config.client,
  //     undefined,
  //     config.key.replaceAll(/\\n/g, "\n"),
  //     config.scope
  //   );

  try {
    // const login = await jwt.authorize();
    // console.log(jwt);

    // const response = await google.analytics("v3").data.ga.get({
    //   "auth": jwt,
    //   "ids": "ga:" + config.id,
    //   "start-date": "30daysAgo",
    //   "end-date": "today",
    //   "metrics": "ga:pageviews",
    // });

    // console.log(response);
    return res.send("success");
  } catch (err) {
    console.log(err);
    return res.send("error: " + err);
  }
}

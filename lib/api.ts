import axios, { AxiosResponse } from "axios";

const instance = (base: "api" | "local" = "api") => {
  return axios.create({
    baseURL: base === "api" ? process.env.NEXT_PUBLIC_API_URL : process.env.NEXT_PUBLIC_APP_URL,
    headers: {
      Authorization: process.env.NEXT_PUBLIC_AUTHORIZATION_TOKEN,
    },
  });
};

/**
 * Universal GET helper function.
 * @param url Endpoint route
 * @param params Param queries
 * @returns result
 */
export const get = <T extends any>(
  route: string,
  params?: Record<string, any>,
  base: "api" | "local" = "api"
): Promise<AxiosResponse> => {
  return new Promise((resolve, reject) => {
    instance(base)
      .get(route, { params })
      .then((response: AxiosResponse) => resolve(response))
      .catch(err => reject(err));
  });
};

/**
 * Universal POST helper function.
 * @param url Endpoint route
 * @param payload Body payload
 * @returns result
 */
export const post = <T extends any>(
  route: string,
  payload?: any,
  base: "api" | "local" = "api"
): Promise<AxiosResponse> => {
  return new Promise((resolve, reject) => {
    instance(base)
      .post(route, payload)
      .then((response: AxiosResponse) => resolve(response))
      .catch(err => reject(err));
  });
};

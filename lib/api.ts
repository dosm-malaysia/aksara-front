import axios from "axios";
import GQLPayload from "graphql/class/GQLPayload";

/**
 * Base Backend APIs
 */
const BACKENDS = {
  CMS: process.env.CMS_URL ?? "http://localhost:8055/",
  CMS_GRAPH: process.env.CMS_GRAPHQL_URL ?? "http://localhost:8055/graphql",
  DO: process.env.NEXT_PUBLIC_API_URL ?? "",
};

/**
 * Universal GET helper function.
 * @param type CMS | CMS_GRAPH | DO
 * @param url Endpoint URL
 * @returns result
 */
export const get = (type: keyof typeof BACKENDS, url: string): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    axios
      .get(type === "CMS_GRAPH" ? BACKENDS[type] : BACKENDS[type].concat(url as string))
      .then(response => {
        switch (type) {
          case "CMS":
          case "CMS_GRAPH":
            resolve(response.data.data);
            break;
          case "DO":
            resolve(response.data);
            break;
          default:
            resolve(response.data);
            break;
        }
      })
      .catch(err => reject(err));
  });
};

/**
 * Universal POST helper function.
 * @param type CMS | CMS_GRAPH | DO
 * @param url Endpoint URL
 * @param payload GQLPayload class | any
 * @returns result
 */
export const post = (
  type: keyof typeof BACKENDS,
  url: string | null,
  payload: GQLPayload | any
): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    axios
      .post(type === "CMS_GRAPH" ? BACKENDS[type] : BACKENDS[type].concat(url as string), payload)
      .then(response => {
        switch (type) {
          case "CMS":
          case "CMS_GRAPH":
            resolve(response.data.data);
            break;
          case "DO":
            resolve(response.data);
            break;
          default:
            resolve(response.data);
            break;
        }
      })
      .catch(err => reject(err));
  });
};

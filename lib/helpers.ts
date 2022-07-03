import { SetStateAction } from "react";
import axios from "axios";
import { OptionType } from "@components/types";
import GQLPayload from "graphql/class/GQLPayload";

/**
 * Base Backend APIs
 */
const BACKENDS = {
    CMS: process.env.CMS_URL ?? "http://localhost:8055/",
    CMS_GRAPH: process.env.CMS_GRAPHQL_URL ?? "http://localhost:8055/graphql",
    ROSH: "ROSH",
};

/**
 * Universal GET helper function.
 * @param type CMS | CMS_GRAPH | ROSH
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
                    case "ROSH":
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
 * @param type CMS | CMS_GRAPH | ROSH
 * @param url Endpoint URL
 * @param payload GQLPayload class | any
 * @returns result
 */
export const post = (type: keyof typeof BACKENDS, url: string | null, payload: GQLPayload | any): Promise<unknown> => {
    return new Promise((resolve, reject) => {
        axios
            .post(type === "CMS_GRAPH" ? BACKENDS[type] : BACKENDS[type].concat(url as string), payload)
            .then(response => {
                switch (type) {
                    case "CMS":
                    case "CMS_GRAPH":
                        resolve(response.data.data);
                        break;
                    case "ROSH":
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

export const isObjEqual = (obj1: any, obj2: any) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
};

export const isObjInArr = (arr: any[], obj: any) => {
    return arr.some((item: any) => isObjEqual(item, obj));
};

export const handleSelectMultipleDropdown = (selectedOption: OptionType, options: OptionType[], useStateHookFunction: React.Dispatch<SetStateAction<OptionType[]>>) => {
    if (options.some(o => isObjEqual(o, selectedOption))) {
        useStateHookFunction(options.filter(o => !isObjEqual(o, selectedOption)));
    } else {
        useStateHookFunction([...options, selectedOption]);
    }
};

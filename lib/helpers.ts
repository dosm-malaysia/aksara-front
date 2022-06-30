import { SetStateAction } from "react";
import axios from "axios";
import { OptionType } from "@components/types";

// TODO: To be replaced with env values
enum BACKENDS {
    CMS = "http://localhost:8055/",
    ROSH = "ROSH",
}

/**
 * Universal GET helper function.
 * @param type CMS | ROSH
 * @param url Endpoint URL
 * @returns result
 */
export const get = (type: keyof typeof BACKENDS, url: string): Promise<Array<any>> => {
    return new Promise((resolve, reject) => {
        axios
            .get(BACKENDS[type].concat(url))
            .then(response => {
                console.log(response.data.data, "data");
                switch (type) {
                    case "CMS":
                        resolve([null, response.data.data]);
                        break;
                    case "ROSH":
                        resolve([null, response.data]);
                        break;
                    default:
                        resolve([null, response.data]);
                        break;
                }
            })
            .catch(err => reject([err]));
    });
};

/**
 * Universal POST helper function.
 * @param type CMS | ROSH
 * @param url Endpoint URL
 * @param payload POST body
 * @returns result
 */
export const post = (type: keyof typeof BACKENDS, url: string, payload: any): Promise<Array<any>> => {
    return new Promise((resolve, reject) => {
        axios
            .post(url, payload)
            .then(response => {
                switch (type) {
                    case "CMS":
                        resolve([null, response.data.data]);
                        break;
                    case "ROSH":
                        resolve([null, response.data]);
                        break;
                    default:
                        resolve([null, response.data]);
                        break;
                }
            })
            .catch(err => reject([err]));
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

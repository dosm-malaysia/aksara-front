import type { NextApiRequest, NextApiResponse } from "next";
import { mkdir, writeFile, access, readFileSync } from "fs";
import { get } from "@lib/helpers";
import { resolve } from "path";

const MANIFEST_NAME = "AKSARA Locales Manifest";
const LOCALE_DIR = "public/locales";

const handler = async (response: NextApiResponse) => {
    console.log("Initialize locale update...");
    const manifestFile = resolve(process.cwd(), "public/locales/manifest.json");

    // Fetch the locales from backend API
    const [err, locales] = await get("CMS", "items/locales?fields=*.*");
    if (err) throw new Error(err);
    console.log("Locales fetched...");

    // Validate locale manifest, return the locales that needs updating
    let updatedLocales: Array<any> = await validateManifest(manifestFile, locales);
    console.log("Locales validated. Locales required to update: ", updatedLocales.length);

    // Generate locale files as required (based on updatedLocales[]) & regenerate the manifest file.
    if (updatedLocales.length > 0) {
        updatedLocales.forEach(locale => {
            const localeDir = resolve(process.cwd(), `${LOCALE_DIR}/${locale.language}`);
            const localeFile = resolve(process.cwd(), `${LOCALE_DIR}/${locale.language}/common.json`);

            access(localeDir, async err => {
                if (!err) {
                    console.log(locale.json, "localeDirIf");
                    // If exists, update the locale files
                    await createLocaleFile(localeFile, locale.json, locale.language);
                } else {
                    // Else, create directory & the locale files afterwards
                    console.log(localeDir, "localeDirElse");
                    mkdir(localeDir, async err => {
                        if (err) throw err;
                        await createLocaleFile(localeFile, locale.json, locale.language);
                    });
                }
            });
        });
        await generateManifestFile(locales, manifestFile);
    } else {
        console.info("All locales are up-to-date. Proceeding with the build... 🚀");
    }

    response.status(200).send({
        message: "Locale updated successfully",
    });
};

const validateManifest = (manifestPath: string, locales: any): Promise<Array<any>> => {
    return new Promise((resolve, reject) => {
        access(manifestPath, err => {
            let updatedLocales: Array<any> = [];

            if (!err) {
                /**
                    If exists, read the existing manifest file & compare with the API result.
                    
                    Comparison condition:
                    1. Compare if have same keys. If new key, add to updatedLocale (means new language added)
                    2. Compare the version timestamp. If different, add to updatedLocale (means there is a new update to the locale)
                    3. Else, do nothing.
                 */
                // console.log(JSON.parse(readManifestFile(manifestPath)));
                const { versions } = JSON.parse(readManifestFile(manifestPath));

                locales.forEach((locale: any) => {
                    if (!Object.keys(versions).includes(locale.language)) updatedLocales.push(locale);
                    else if (new Date(locale.date_updated).getTime() !== versions[locale.language]) updatedLocales.push(locale);
                });

                resolve(updatedLocales);
            } else {
                // Else, update all locale files
                updatedLocales = [...locales];
                resolve(updatedLocales);
            }
        });
    });
};

const readManifestFile = (path: string) => {
    return readFileSync(path).toString();
};

const generateManifestFile = async (locales: any, manifestPath: string) => {
    const versions = locales.reduce((previous: any, current: any) => {
        return {
            ...previous,
            [current.language]: new Date(current.date_updated).getTime(),
        };
    }, {});
    const manifest = {
        name: MANIFEST_NAME,
        versions: versions,
    };
    await createLocaleFile(manifestPath, manifest, "Locale manifest");
};

const createLocaleFile = async (path: string, json: string | object, language = "File") => {
    return new Promise((resolve, reject) => {
        writeFile(path, JSON.stringify(json), { flag: "w+" }, err => {
            if (err) {
                reject(err);
                throw err;
            }

            console.info(`${language} successfully created... ✅`);
            resolve(null);
        });
    });
};

export default handler;

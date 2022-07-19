import { writeFile, readFileSync } from "fs";
import { mkdir, access } from "fs/promises";
import { get } from "@lib/helpers";
import { resolve, dirname } from "path";
import type { NextApiRequest, NextApiResponse } from "next";

const MANIFEST_NAME = "AKSARA Locales Manifest";
const LOCALE_DIR = "public/locales";

interface NextRequestMiddleware extends NextApiRequest {
  headers: {
    cms_webhook_key: string;
    host: string;
  };
}

const middleware = (request: NextRequestMiddleware, response: NextApiResponse) => {
  if (!request.headers.cms_webhook_key) {
    response.status(403).json({ error: "Invalid Request. Missing webhook key" });
    return false;
  }

  if (!process.env.CMS_WEBHOOK_KEY) throw new Error("CMS_WEBHOOK_KEY_URL env var is not defined");

  if (request.headers.cms_webhook_key !== process.env.CMS_WEBHOOK_KEY) {
    response.status(403).json({ error: "Forbidden. Wrong webhook key" });
    return false;
  }

  if (!process.env.CMS_URL) throw new Error("CMS_URL env var is not defined");

  if (request.headers.host !== new URL(process.env.CMS_URL).hostname) {
    response.status(403).json({ error: "Forbidden. Invalid request origin" });
    return false;
  }
  return true;
};

const handler = async (request: NextRequestMiddleware, response: NextApiResponse) => {
  const ok = middleware(request, response);

  if (ok) {
    console.log("Initialize locale update...");
    const manifestFile = resolve(process.cwd(), "public/locales/manifest.json");

    // Fetch the locales from backend API
    const locales = await get("CMS", "items/locale?fields=*.*");
    console.log("Locales fetched...");

    // Validate locale manifest, return the locales that needs updating
    let [updatedLocales, count] = await validateManifest(manifestFile, locales);
    console.log("Locales validated. Required to update: ", count);

    // Generate locale files as required (based on updatedLocales[]) & regenerate the manifest file.
    if (count > 0) {
      for (let [path, locales] of Object.entries(updatedLocales)) {
        (locales as Array<any>).forEach(async (locale: any) => {
          const localeFile = resolve(
            process.cwd(),
            `${LOCALE_DIR}/${locale.languages_code}/${path}`
          );
          await createLocaleFile(localeFile, locale.json, locale.languages_code);
        });
      }

      generateManifestFile(locales, manifestFile);
    } else {
      console.info("All locales are up-to-date. Proceeding with the build... 🚀");
    }
    response.status(200).json({ message: "Request successful" });
  }
};

const validateManifest = (manifestPath: string, locales: any): Promise<Array<any>> => {
  return new Promise(async (resolve, reject) => {
    let updatedLocales: Record<string, Array<any>> = {};
    let count = 0;

    const manifestExist = await isExists(manifestPath);
    if (manifestExist) {
      const { versions } = JSON.parse(readManifestFile(manifestPath));

      locales.forEach((locale: any) => {
        let basket: any[] = [];
        if (!Object.keys(versions).includes(locale.path)) {
          basket = [...locale.translations];
          count = count + basket.length;
        } else if (locale.translations.length > 0) {
          locale.translations.forEach((item: any) => {
            if (versions[locale.path][item.languages_code] !== new Date(item.timestamp).getTime()) {
              basket = [...basket, item];
              count++;
            }
          });
        }
        if (basket.length > 0) updatedLocales[locale.path] = basket;
      });

      resolve([updatedLocales, count]);
    } else {
      // Else, update all locale files
      locales.forEach((locale: any) => {
        updatedLocales[locale.path] = locale.translations;
        count = count + locale.translations.length;
      });

      resolve([updatedLocales, count]);
    }
  });
};

const readManifestFile = (path: string) => {
  return readFileSync(path).toString();
};

const generateManifestFile = async (locales: any, manifestPath: string) => {
  let versions: Record<string, Record<string, number>> = {};

  locales.forEach((locale: any) => {
    versions[locale.path] = locale.translations.reduce((previous: any, current: any) => {
      return {
        ...previous,
        [current.languages_code]: new Date(current.timestamp).getTime(),
      };
    }, {});
  });

  const manifest = {
    name: MANIFEST_NAME,
    versions: versions,
  };
  await createLocaleFile(manifestPath, manifest, "Locale manifest");
};

async function isExists(path: string) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

const createLocaleFile = async (path: string, json: string | object, language = "File") => {
  return new Promise(async (resolve, reject) => {
    try {
      const dir = dirname(path);
      const exist = await isExists(dir);
      if (!exist) {
        await mkdir(dir, { recursive: true });
      }

      writeFile(path, JSON.stringify(json), { flag: "w+" }, err => {
        if (err) reject(err);

        console.info(
          `${language != "File" ? language : "Manifest "}/${path} successfully updated... ✅`
        );
      });
    } catch (err: any) {
      throw new Error(err);
    }
  });
};

export default handler;

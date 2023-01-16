import { createElement, ReactElement, ReactNode } from "react";
import { useTranslation as _useTranslation } from "next-i18next";

/**
 * Modified translation hook. Supports anchor (<a>) tag generation.
 * @tutorial useTranslation Use the hook as usual. To create anchor (<a>) from the i18n file, follow the markdown syntax for link: [text](url)
 * @example { "key": "This is an example [link](https://open.dosm.gov.my)" }
 *
 * @param namespace i18n Translation file
 * @returns t, i18n
 */
export const useTranslation = (namespace: string = "common") => {
  const { t, i18n } = _useTranslation(namespace);
  const regex = /\[([^\[]+)\]\((.*)\)/;
  const delimiter = /(?=\[)(.*)(?<=.*\))/g;

  const _t = (key: string, params?: any): string | any => {
    let translation = t(key, params);
    let matches = translation.split(delimiter);

    if (!matches.length) return translation;

    return matches.map(item => {
      const match = item.match(regex);
      if (match === null) return item;
      const [_, text, url] = match;
      return createElement("a", { href: url, className: "text-primary hover:underline" }, text);
    }) as ReactElement[];
  };

  return {
    t: _t,
    i18n,
  };
};

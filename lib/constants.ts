// GENERAL
export enum BREAKPOINTS {
  SM = 640,
  MD = 768,
  LG = 1024,
  XL = 1440,
}

/**
 * MALAYSIA def.
 */
export const MALAYSIA: Record<string, string> = {
  key: "mys",
  name: "Malaysia",
};

/**
 * STATES defs.
 */
export const STATES: Array<Record<string, any>> = [
  {
    key: "jhr",
    name: "Johor",
  },
  {
    key: "kdh",
    name: "Kedah",
  },
  {
    key: "ktn",
    name: "Kelantan",
  },
  {
    key: "kul",
    name: "W.P. Kuala Lumpur",
  },
  {
    key: "lbn",
    name: "W.P. Labuan",
  },
  {
    key: "mlk",
    name: "Melaka",
  },
  {
    key: "nsn",
    name: "Negeri Sembilan",
  },
  {
    key: "phg",
    name: "Pahang",
  },
  {
    key: "prk",
    name: "Perak",
  },
  {
    key: "pls",
    name: "Perlis",
  },
  {
    key: "png",
    name: "Pulau Pinang",
  },
  {
    key: "pjy",
    name: "W.P. Putrajaya",
  },
  {
    key: "sbh",
    name: "Sabah",
  },
  {
    key: "swk",
    name: "Sarawak",
  },
  {
    key: "sgr",
    name: "Selangor",
  },
  {
    key: "trg",
    name: "Terengganu",
  },
];

/**
 * Dictionary of code to country/state name. IIFE
 * @example CountryAndStates["mlk"] -> "Melaka"
 */
export const CountryAndStates: Record<string, string> = (() => {
  return [MALAYSIA, ...STATES].reduce((prev, current) => {
    return { ...prev, ...{ [current.key]: current.name } };
  }, {});
})();

/**
 * Use AKSARA_COLOR instead.
 * @deprecated COVID_COLOR
 */
export const COVID_COLOR: Record<number, string> = {
  100: "#2563EB4D",
  200: "#6BABFA",
  300: "#2563EB",
};

/**
 * Use AKSARA_COLOR instead.
 * @deprecated COVIDVAX_COLOR
 */
export const COVIDVAX_COLOR: Record<number, string> = {
  100: "#9FE8B1",
  200: "#31C752",
  300: "#228F3A",
  400: "#135523",
};

/**
 * Use AKSARA_COLOR instead.
 * @deprecated BLOOD_COLOR
 */
export const BLOOD_COLOR: Record<number, string> = {
  100: "#FFC0C0",
  200: "#FF6F70",
  300: "#FF4E4E",
  400: "#FF0001",
  500: "#DC2626",
};

/**
 * Use AKSARA_COLOR instead.
 * @deprecated ORGAN_COLOR
 */
export const ORGAN_COLOR: Record<number, string> = {
  100: "#CFF6D9",
  200: "#9FE8B1",
  300: "#84E19A",
  400: "#31C752",
  500: "#29AB47",
  600: "#228F3A",
};

/**
 * Use AKSARA_COLOR instead.
 * @deprecated PEKA_COLOR
 */
export const PEKA_COLOR: Record<number, string> = {
  100: "#FCEDFF",
  200: "#F6CCFD",
  300: "#DA9FE3",
  400: "#B560C2",
  500: "#9154C0",
  600: "#6731A8",
};

/**
 * MYR denomination colors
 * @example MYR_COLOR.RM100 -> "#a199c0"
 */
export const MYR_COLOR = {
  RM100: "#A199C0",
  RM100_H: "#A199C01A",
  RM50: "#20A5A4",
  RM50_H: "#20A5A41A",
  RM20: "#FCCA6B",
  RM20_H: "#FCCA6B1A",
  RM10: "#F6908B",
  RM10_H: "#F6908B1A",
  RM5: "#7DC698",
  RM5_H: "#7DC6981A",
  RM1: "#7DAEE8",
  RM1_H: "#7DAEE81A",
  SEN50: "#C6B453",
  SEN50_H: "#C6B4531A",
  SEN20: "#C6B453",
  SEN20_H: "#C6B4531A",
  SEN10: "#A5A5A5",
  SEN10_H: "#A5A5A51A",
};

/**
 * Dictionary of AKSARA's color palette.
 * @example AKSARA_COLOR.PRIMARY -> "#2563EB"
 */
export const AKSARA_COLOR: Record<string, string> = {
  BLACK: "#0F172A",
  BLACK_H: "#0F172A1A",
  DANGER: "#DC2626",
  DANGER_H: "#DC26261A",
  PRIMARY: "#2563EB",
  PRIMARY_H: "#2563EB1A",
  PRIMARY_DARK: "#0C204E",
  PRIMARY_DARK_H: "#0C204E1A",
  SUCCESS: "#22C55E",
  SUCCESS_H: "#22C55E1A",
  WARNING: "#FBBF24",
  WARNING_H: "#FBBF241A",
  DIM: "#64748B",
  DIM_H: "#64748B1A",
  WASHED: "#F1F5F9",
  WASHED_H: "#F1F5F9CC",
  OUTLINE: "#E2E8F0",
} as const;

/**
 * Use AKSARA_COLOR instead.
 * @deprecated GRAYBAR_COLOR
 */
export const GRAYBAR_COLOR: Record<number, string> = {
  100: "#D1D5DB",
  200: "#94A3B8",
  300: "#E2E8F0",
  400: "#EAEAEB",
};

/**
 * Convert locale code to shorter code. Used in reference to AKSARA's API
 * @example SHORT_LANG["ms-MY"] -> "bm"
 */
export const SHORT_LANG: Record<string, string> = {
  "ms-MY": "bm",
  "en-GB": "en",
} as const;

/**
 * Convert AKSARA API's periods to the designated timeseries interval.
 * @example SHORT_PERIOD["WEEKLY"] -> "weekly"
 */
export const SHORT_PERIOD: Record<string, string> = {
  DAILY: "auto",
  WEEKLY: "day",
  MONTHLY: "month",
  QUARTERLY: "quarter",
  YEARLY: "year",
} as const;

// TODO (@irfancoder): update languages array to desired format
export const languages = [
  { label: "English", value: "en" },
  { label: "Malay", value: "ms" },
];

export const intervalOptions = [
  "Daily",
  "Weekly",
  "Monthly",
  "Quarterly",
  "Yearly",
  "No fixed cadence",
];

export const geographyOptions = [
  "National",
  "State",
  "District",
  "Mukim",
  "Parliament",
  "DUN",
];

export const dataStartOptions = Array(15)
  .fill(0)
  .map((_, i) => 1990 + i)
  .reverse();

export const dataEndOptions = Array(15)
  .fill(0)
  .map((_, i) => 2020 + i);

export const dataSourceOptions = [
  "DOSM",
  "Ministry of Health",
  "Ministry of Transport",
  "MoSTI",
];

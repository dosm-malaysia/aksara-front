import { ReactElement } from "react";

export type OptionType<L = ReactElement | string, V = string, Z = string> = {
  label: L;
  value: V;
  code?: Z;
};

import type { NextPage } from "next";
import type { ReactElement } from "react";
import type { AppProps } from "next/app";

export type { ReactElement, ReactNode } from "react";

export type AppPropsLayout = AppProps & {
  Component: Page;
};

export type Page = NextPage & {
  layout?: (page: ReactElement) => ReactElement;
};

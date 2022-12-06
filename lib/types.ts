import type { ChartOptions } from "chart.js";
import { AnnotationPluginOptions } from "chartjs-plugin-annotation";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";

export type AppPropsLayout = AppProps & {
  Component: Page;
};

export type Page = NextPage & {
  layout?: (page: ReactNode) => ReactElement;
};

// CHART INTERFACE
export interface IChart {
  id: string;
  keys: string[];
  data: any;
  [key: string]: any;
}

export type ChartCrosshairOption = ChartOptions & {
  plugins: {
    crosshair?:
      | {
          line: {
            width?: number;
            color?: string;
            dashPattern?: [number, number];
          };
          zoom: {
            enabled: boolean;
          };
          sync: {
            enabled: boolean;
          };
        }
      | false;
    annotation?: AnnotationPluginOptions | false;
  };
};
export type BarCrosshairOption = ChartOptions<"bar"> & ChartCrosshairOption;
export type LineCrosshairOption = ChartOptions<"line"> & ChartCrosshairOption;

export type DownloadOption = {
  key: string;
  image: string | false | undefined;
  title: string;
  description: string;
  icon: JSX.Element;
  href: string | (() => void);
};

export type DownloadOptions = {
  chart: DownloadOption[];
  data: DownloadOption[];
};

export type ChoroplethColors = "blues" | "reds" | "greens" | "purples";

export type EventType =
  | "file_download"
  | "page_view"
  | "change_language"
  | "select_dropdown"
  | "copy_code";

export interface AnalyticsEvent {
  action: string;
  category: string;
  label: string;
  value: string;
}

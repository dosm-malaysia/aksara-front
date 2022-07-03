import type { NextPage } from "next";
import type { ReactElement, ReactNode } from "react";

export type { ReactElement, ReactNode } from "react";

export type Page = NextPage & {
    layout?: (page: ReactElement) => ReactNode;
};

import "../styles/globals.css";
import type { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import { Page, ReactElement } from "@lib/types";

type AppPropsLayout = AppProps & {
    Component: Page;
};

function App({ Component, pageProps }: AppPropsLayout) {
    const layout = Component.layout ?? ((page: ReactElement) => page);
    return layout(<Component {...pageProps} />);
}

export default appWithTranslation(App);

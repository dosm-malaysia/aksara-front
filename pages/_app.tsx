import "../styles/globals.css";
import { appWithTranslation } from "next-i18next";
import { AppPropsLayout } from "@lib/types";

function App({ Component, pageProps }: AppPropsLayout) {
    const layout = Component.layout ?? ((page: any) => page);
    return layout(<Component {...pageProps} />);
}

export default appWithTranslation(App);

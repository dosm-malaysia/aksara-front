import "../styles/globals.css";
import { appWithTranslation } from "next-i18next";
import { AppPropsLayout } from "@lib/types";
import { Layout } from "@components/index";

function App({ Component, pageProps }: AppPropsLayout) {
  const layout = (page: any) => (Component.layout ? page : <Layout>{page}</Layout>);
  return layout(<Component {...pageProps} />);
}

export default appWithTranslation(App);

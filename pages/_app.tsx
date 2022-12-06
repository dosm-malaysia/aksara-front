import "../styles/globals.css";
import { appWithTranslation } from "next-i18next";
import { AppPropsLayout } from "@lib/types";
import { Layout } from "@components/index";
import { useEffect, ReactNode } from "react";
import { useRouter } from "next/router";
import mixpanel from "mixpanel-browser";
import mixpanelConfig from "@config/mixpanel";
import { track, init_session } from "@lib/mixpanel";

// Global settings
mixpanel.init(mixpanelConfig.token, { debug: process.env.NODE_ENV === "development" });

// App instance
function App({ Component, pageProps }: AppPropsLayout) {
  const layout = Component.layout ?? ((page: ReactNode) => <Layout>{page}</Layout>);
  const router = useRouter();

  useEffect(() => {
    // trigger page view event for client-side navigation
    const handleRouteChange = (url: string) => {
      track("page_view", url);
      init_session();
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return layout(
    <>
      <Component {...pageProps} />
    </>
  );
}

export default appWithTranslation(App);

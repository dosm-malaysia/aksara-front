import "../styles/globals.css";
import { appWithTranslation } from "next-i18next";
import { AppPropsLayout, ReactElement } from "@lib/types";
import { Layout } from "@components/index";
import { useEffect } from "react";
import { pageTrack } from "@lib/helpers";
import { useRouter } from "next/router";

function App({ Component, pageProps }: AppPropsLayout) {
  const layout = Component.layout ?? ((page: ReactElement) => <Layout>{page}</Layout>);
  const router = useRouter();

  useEffect(() => {
    // trigger page view event for client-side navigation
    const handleRouteChange = (url: string) => {
      pageTrack(url);
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

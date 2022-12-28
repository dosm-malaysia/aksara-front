import type { GeoJsonObject } from "geojson";

import { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from "next";
import { Page } from "@lib/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import KawasankuDashboard from "@dashboards/kawasanku";
import Metadata from "@components/Metadata";
// import MalaysiaGeojson from "@lib/geojson/malaysia.json";

import { useTranslation } from "next-i18next";
import { STATES } from "@lib/schema/kawasanku";
import { get } from "@lib/api";
import { useState } from "react";
import { useWatch } from "@hooks/useWatch";

const KawasankuState: Page = ({
  ctx,
  bar,
  jitterplot,
  pyramid,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();
  const [geo, setGeo] = useState<undefined | GeoJsonObject>(undefined);

  useWatch(
    () => {
      import(`@lib/geojson/kawasanku/state/${ctx.state}`).then(item => {
        setGeo(item.default as unknown as GeoJsonObject);
      });
    },
    [ctx.state],
    true
  );

  return (
    <>
      <Metadata
        title={`${t("nav.megamenu.dashboards.kawasanku")} • 
        ${STATES.find(state => ctx.state === state.value)?.label}`}
        description={t("kawasanku.description")}
        keywords={""}
      />
      <KawasankuDashboard
        bar={bar}
        jitterplot={jitterplot}
        pyramid={pyramid}
        jitterplot_options={STATES.filter(item => item.value !== "malaysia")}
        geojson={geo}
      />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  /* First visit: SSR, consequent visits: ISR */
  //   let paths: Array<any> = [];
  //   STATES.forEach(state => {
  //     paths = paths.concat([
  //       {
  //         params: {
  //           state: state.value,
  //         },
  //       },
  //       {
  //         params: {
  //           state: state.value,
  //         },
  //         locale: "ms-MY",
  //       },
  //     ]);
  //   });

  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);

  const { data } = await get("/dashboard/", {
    "dashboard": "kawasanku_admin",
    "area": params!.state,
    "area-type": "state",
  });
  //   const state = STATES.find(state => params!.state === state.value)?.label;

  return {
    props: {
      ...i18n,
      ctx: params,
      bar: data.bar_chart,
      jitterplot: data.jitter_chart,
      pyramid: data.pyramid_chart,
    },
  };
};

export default KawasankuState;

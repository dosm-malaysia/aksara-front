import type { GeoJsonObject } from "geojson";
import { InferGetStaticPropsType, GetStaticProps, GetStaticPaths } from "next";
import { Page } from "@lib/types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import KawasankuDashboard from "@dashboards/kawasanku";
import Metadata from "@components/Metadata";
import MalaysiaGeojson from "@lib/geojson/malaysia.json";

import { useTranslation } from "next-i18next";
import { STATES, STATE_MAP, PARLIMENS } from "@lib/schema/kawasanku";
import { get } from "@lib/api";

const KawasankuArea: Page = ({
  ctx,
  bar,
  jitterplot,
  jitterplot_options,
  pyramid,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();

  return (
    <>
      <Metadata
        title={`${t("nav.megamenu.dashboards.kawasanku")} • 
        ${PARLIMENS[ctx.state].find(parlimen => parlimen.value === ctx.id)?.label}`}
        description={t("kawasanku.description")}
        keywords={""}
      />
      <KawasankuDashboard
        area_type="parlimen"
        bar={bar}
        jitterplot={jitterplot}
        pyramid={pyramid}
        jitterplot_options={jitterplot_options}
        geojson={MalaysiaGeojson as GeoJsonObject}
      />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  /* First visit: SSR, consequent visits: ISR */

  //   let paths: Array<any> = [];

  //   STATES.filter(state => state.value !== "malaysia").forEach(state => {
  //     PARLIMENS[state.value].forEach(({ value }) => {
  //       paths = paths.concat([
  //         {
  //           params: {
  //             state: state.value,
  //             id: value,
  //           },
  //         },
  //         {
  //           params: {
  //             state: state.value,
  //             id: value,
  //           },
  //           locale: "ms-MY",
  //         },
  //       ]);
  //     });
  //   });

  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);

  const { data } = await get("/dashboard/", {
    "dashboard": "kawasanku_electoral",
    "area": params!.id,
    "area-type": "parlimen",
  });

  const options = Object.entries(PARLIMENS).flatMap(([key, parlimens]) =>
    parlimens.map(({ label, value }) => ({
      label: `${label}, ${STATE_MAP[key]}`,
      value: value,
    }))
  );

  return {
    props: {
      ...i18n,
      ctx: params,
      bar: data.bar_chart,
      jitterplot: data.jitter_chart,
      pyramid: data.pyramid_chart,
      jitterplot_options: options,
    },
  };
};

export default KawasankuArea;

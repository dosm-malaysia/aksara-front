import type { GeoJsonObject } from "geojson";
import type { OptionType } from "@components/types";
import type { BarMeterData } from "@components/Chart/BarMeter";
import type { JitterData } from "@components/Chart/Jitterplot";
import Container from "@components/Container";
import Hero from "@components/Hero";
import Section from "@components/Section";
import { useTranslation } from "next-i18next";
import { FunctionComponent, useEffect, useMemo } from "react";
import JitterplotOverlay from "@components/Chart/Jitterplot/overlay";
import Dropdown from "@components/Dropdown";
import Button from "@components/Button";
import Spinner from "@components/Spinner";
import { XMarkIcon } from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";

import { useData } from "@hooks/useData";
import { useRouter } from "next/router";
import { STATES, DISTRICTS, PARLIMENS, DUNS } from "@lib/schema/kawasanku";
import { routes } from "@lib/routes";
import { track } from "@lib/mixpanel";

/**
 * Kawasanku Dashboard
 * @overview Status: Live (Partially on-hold)
 */

// const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });
const Jitterplot = dynamic(() => import("@components/Chart/Jitterplot"), { ssr: false });
const Pyramid = dynamic(() => import("@components/Chart/Pyramid"), { ssr: false });
const OSMapWrapper = dynamic(() => import("@components/OSMapWrapper"), { ssr: false });
const BarMeter = dynamic(() => import("@components/Chart/BarMeter"), { ssr: false });

interface KawasankuDashboardProps {
  area_type?: AreaType | undefined;
  pyramid?: any;
  bar: any;
  jitterplot: any;
  jitterplot_options: Array<OptionType>;
  geojson?: GeoJsonObject;
}

type AreaType = "district" | "dun" | "parlimen";

const KawasankuDashboard: FunctionComponent<KawasankuDashboardProps> = ({
  area_type,
  pyramid,
  bar,
  jitterplot,
  jitterplot_options,
  geojson,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const state = (router.query.state as string) ?? "malaysia";

  const AREA_TYPES = [
    {
      label: t("kawasanku.area_types.district"),
      value: "district",
    },
    {
      label: t("kawasanku.area_types.parlimen"),
      value: "parlimen",
    },
    {
      label: t("kawasanku.area_types.dun"),
      value: "dun",
    },
  ];

  const AREA_OPTIONS: Record<string, Record<string, OptionType[]>> = {
    district: DISTRICTS,
    parlimen: PARLIMENS,
    dun: DUNS,
  };
  const active = useMemo(() => {
    const uid = router.query.id ? router.query.id : router.query.state;

    return uid !== "malaysia" ? jitterplot_options.find(option => option.value === uid) : undefined;
  }, [router.query, jitterplot_options]);

  const { data, setData } = useData({
    loading: false,
    state: STATES.find(item => item.value === state),
    area_type: area_type ? AREA_TYPES.find(item => item.value === area_type) : undefined,
    area: area_type
      ? AREA_OPTIONS[area_type as AreaType][state].find(item => item.value === active?.value)
      : undefined,
    comparator: [],
  });

  const availableAreaTypes = useMemo(() => {
    if (["w.p._kuala_lumpur", "w.p._putrajaya", "w.p._labuan"].includes(data.state.value)) {
      return AREA_TYPES.filter(area => area.value !== "dun");
    }

    return AREA_TYPES;
  }, [data.state]);

  const handleComparator = (e: OptionType) => {
    if (data.comparator.length >= 3) return;
    if (data.comparator.includes(e.label)) return;

    setData("comparator", data.comparator.concat(e.label));
  };

  const isMalaysia = useMemo(() => data.state.value === "malaysia", [data.state]);

  useEffect(() => {
    track("page_view", {
      type: "dashboard",
      id: "nav.megamenu.dashboards.kawasanku",
      name_en: "Kawasanku",
      name_bm: "Kawasanku",
      route: router.asPath,
    });
  }, []);

  useEffect(() => {
    router.events.on("routeChangeComplete", () => setData("loading", false));
    return () => {
      router.events.off("routeChangeComplete", () => null);
    };
  }, [router.events]);

  return (
    <>
      <Hero background="relative kawasanku-banner">
        <div className="space-y-4 lg:w-2/3">
          <span className="text-sm font-bold uppercase tracking-widest text-dim">
            {t("nav.megamenu.dashboards.kawasanku")}
          </span>
          <h3 className="text-black"> {t("kawasanku.header")}</h3>
          <p className="text-dim">{t("kawasanku.description")}</p>

          <div className="flex w-full flex-col flex-wrap items-start justify-start gap-2 lg:flex-row lg:items-center">
            <div className="flex items-center gap-2">
              <p className="font-bold text-dim">{t("kawasanku.action")}:</p>
              <Spinner loading={data.loading} className="block place-self-center lg:hidden" />
            </div>

            <Dropdown
              options={STATES}
              selected={data.state}
              width="w-full lg:w-fit"
              sublabel={!isMalaysia ? t("common.state") + ":" : ""}
              onChange={(e: OptionType) => {
                setData("state", e);
                setData("loading", true);
                router.push(routes.KAWASANKU.concat("/", e.value !== "malaysia" ? e.value : ""));
              }}
              anchor="left"
            />
            <Dropdown
              anchor="left"
              options={availableAreaTypes}
              selected={data.area_type}
              onChange={(e: OptionType) => {
                setData("area_type", e);
                setData("area", undefined);
              }}
              disabled={data.state.value === "malaysia"}
              sublabel={`${t("kawasanku.geofilter")}:`}
              placeholder={t("common.select")}
              width="w-full lg:w-fit"
            />
            <Dropdown
              anchor="left"
              options={
                data.area_type && data.state.value !== "malaysia"
                  ? AREA_OPTIONS[data.area_type.value][data.state.value]
                  : []
              }
              disabled={!data.area_type || data.state.value === "malaysia"}
              selected={data.area}
              onChange={e => {
                setData("area", e);
                setData("loading", true);
                router.push(
                  routes.KAWASANKU.concat(
                    "/",
                    data.state.value,
                    "/",
                    data.area_type.value,
                    "/",
                    e.value
                  )
                );
              }}
              placeholder={t("common.select")}
              width="w-full lg:w-fit"
            />
            <div className="flex items-center">
              <Spinner loading={data.loading} className="hidden place-self-center lg:block" />
              {(data.area_type || data.area) && (
                <Button
                  icon={<XMarkIcon className="h-4 w-4" />}
                  onClick={() => router.push(routes.KAWASANKU)}
                >
                  {t("common.clear_all")}
                </Button>
              )}
            </div>
          </div>
        </div>

        <OSMapWrapper
          geojson={geojson}
          className="absolute top-0 -right-0 -z-10 h-full overflow-hidden lg:h-full lg:w-[40vw]"
          enableZoom={false}
        />
      </Hero>

      <Container className="min-h-screen">
        {/* What does the population of {{ area }} look like? */}
        <Section
          title={t("kawasanku.section_1.title", { area: data.area?.label ?? data.state.label })}
          date={"MyCensus 2020"}
        >
          {/* <div className="grid grid-cols-1 gap-12 xl:grid-cols-5"> */}
          <div
            className={[
              "grid gap-12",
              !Boolean(area_type) ? "grid-cols-1 xl:grid-cols-5" : "",
            ].join(" ")}
          >
            {!Boolean(area_type) && (
              <div className="col-span-1 w-full lg:col-span-2">
                <Pyramid
                  data={{
                    labels: pyramid.data.x,
                    datasets: [
                      {
                        label: t("kawasanku.keys.male"),
                        data: pyramid.data.male,
                        backgroundColor: "#0C204E",
                        borderWidth: 0,
                      },
                      {
                        label: t("kawasanku.keys.female"),
                        data: pyramid.data.female,
                        backgroundColor: "#B54768",
                        borderWidth: 0,
                      },
                    ],
                  }}
                  title={t("kawasanku.gender_distribution")}
                  className="h-[500px] w-full"
                />
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:col-span-3 lg:grid-cols-3 lg:gap-12">
              {Object.entries(bar.data).map(([key, data]) => (
                <BarMeter
                  key={key}
                  title={t(`kawasanku.${key}`)}
                  data={data as BarMeterData[]}
                  layout="horizontal"
                  sort="desc"
                  unit="%"
                  formatX={key => t(`kawasanku.keys.${key}`)}
                />
              ))}
            </div>
          </div>
        </Section>

        {/* A comparison of key variables across {{ type }} */}
        <Section
          title={t("kawasanku.section_2.title", {
            type: data.area_type?.label ?? t("common.state"),
          })}
          date={"MyCensus 2020"}
        >
          <div className="flex w-full flex-wrap gap-2 pb-12 lg:flex-row">
            <Dropdown
              anchor="left"
              width="w-fit"
              sublabel="Spotlight:"
              disabled={data.comparator.length >= 3}
              placeholder="Select "
              options={jitterplot_options}
              onChange={handleComparator}
            />

            {active?.label && (
              <p className="flex items-center gap-2 py-1 px-2 text-sm font-medium leading-6">
                {active.label}
                <span className="block h-2 w-2 rounded-full bg-black" />
              </p>
            )}

            {data.comparator.length > 0 && (
              <>
                {data.comparator.map((item: string, index: number) => {
                  const styles = ["bg-danger", "bg-primary", "bg-warning"];
                  return (
                    <Button
                      key={index}
                      className="border bg-washed py-1 px-2 text-sm font-medium leading-6"
                      icon={
                        <XMarkIcon
                          className="h-4 w-4"
                          onClick={() =>
                            setData(
                              "comparator",
                              data.comparator.filter((place: string) => place !== item)
                            )
                          }
                        />
                      }
                    >
                      <>
                        {item}
                        <div className={[styles[index], "h-2 w-2 rounded-full"].join(" ")} />
                      </>
                    </Button>
                  );
                })}
                <Button
                  icon={<XMarkIcon className="h-4 w-4" />}
                  onClick={() => setData("comparator", [])}
                >
                  {t("common.clear_all")}
                </Button>
              </>
            )}
          </div>
          <div className="relative space-y-10">
            <JitterplotOverlay areaType={area_type as AreaType | "state"} />
            {Object.entries(jitterplot.data).map(([key, dataset]) => (
              <Jitterplot
                key={key}
                title={t(`kawasanku.${key}`)}
                data={dataset as JitterData[]}
                active={active?.label as string}
                actives={data.comparator}
                format={key => t(`kawasanku.keys.${key}`)}
              />
            ))}
          </div>
          <small className="inline-block pt-4 text-gray-500">
            <i>{t("kawasanku.section_2.note")}</i>
          </small>
        </Section>
        {/* <Section
          title={"A geographic visualisation of selected indicators"}
          date={"MyCensus 2020"}
        >
          <Choropleth />
        </Section> */}
      </Container>
    </>
  );
};

export default KawasankuDashboard;

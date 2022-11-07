import { Hero, Container, Tabs, Panel, Section, Slider } from "@components/index";
import { CountryAndStates, BREAKPOINTS } from "@lib/constants";
import { useWindowWidth } from "@hooks/useWindowWidth";
import dynamic from "next/dynamic";
import { FunctionComponent, useCallback, useMemo, useState } from "react";
import { numFormat } from "@lib/helpers";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { DateTime } from "luxon";
import { useRouter } from "next/router";

const Heatmap = dynamic(() => import("@components/Chart/Heatmap"), { ssr: false });
const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });
const BarMeter = dynamic(() => import("@components/Chart/BarMeter"), { ssr: false });
const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });
const ChoroplethWorld = dynamic(() => import("@components/Chart/ChoroplethWorld"), { ssr: false });
const Table = dynamic(() => import("@components/Chart/Table"), { ssr: false });

interface CovidNOWDashboardProps {
  last_updated: number;
  barmeter: any;
  timeseries: any;
  heatmap: any;
  choropleth_world: any;
  choropleth_malaysia: any;
}

const CovidNowDashboard: FunctionComponent<CovidNOWDashboardProps> = ({
  last_updated,
  timeseries,
  heatmap,
  barmeter,
  choropleth_world,
  choropleth_malaysia,
}) => {
  const [limit, setLimit] = useState([0, timeseries.data.x.length - 1]);

  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < BREAKPOINTS.MD;
  const router = useRouter();
  const { t } = useTranslation("common");

  const filterTimeline = () => {
    return {
      x: timeseries.data.x.slice(limit[0], limit[1] + 1),
      y: timeseries.data.y.slice(limit[0], limit[1] + 1),
      line: timeseries.data.line.slice(limit[0], limit[1] + 1),
    };
  };

  const filtered_timeline = useCallback(filterTimeline, [limit]);

  const worldMapConfig = [
    {
      header: "",
      id: "iso3",
      accessorKey: "data",
      enableSorting: false,
      cell: (item: any) => {
        const state = item.getValue() as any;
        return (
          <div className="flex items-center gap-3 text-left">
            <span>{state.country}</span>
          </div>
        );
      },
    },
    {
      id: "data.users",
      header: t("covidnow.user"),
      accessorFn: (item: any) => numFormat(item.data.users, "standard"),
      sortingFn: "localeNumber",
      sortDescFirst: true,
    },
    {
      id: "data.views",
      header: t("covidnow.views"),
      accessorFn: (item: any) => numFormat(item.data.views, "standard"),
      sortingFn: "localeNumber",
      sortDescFirst: true,
    },
    {
      id: "data.views_perc",
      header: t("covidnow.%_views"),
      accessorFn: (item: any) => Math.round(item.data.perc_views * 100) / 100 + "%",
      sortingFn: "localeNumber",
      sortDescFirst: true,
    },
  ];

  const malaysiaMapConfig = [
    {
      header: "",
      id: "state",
      accessorKey: "state",
      enableSorting: false,
      cell: (item: any) => {
        const state = item.getValue() as string;
        return (
          <div className="flex items-center gap-3">
            <Image
              src={`/static/images/states/${state}.jpeg`}
              width={28}
              height={16}
              alt={CountryAndStates[state]}
            />
            <span>{CountryAndStates[state]}</span>
          </div>
        );
      },
    },
    {
      id: "data.total_user",
      header: t("covidnow.user"),
      accessorFn: (item: any) => numFormat(item.data.users, "standard"),
      sortDescFirst: true,
    },
    {
      id: "data.views",
      header: t("covidnow.views"),
      accessorFn: (item: any) => numFormat(item.data.views, "standard"),
      sortDescFirst: true,
    },
    {
      id: "data.views_perc",
      header: t("covidnow.%_views"),
      accessorFn: (item: any) => Math.round(item.data.views_perc * 100) / 100 + "%",
      sortDescFirst: true,
    },
    {
      id: "data.pop_perc",
      header: t("covidnow.%_population"),
      accessorFn: (item: any) => Math.round(item.data.pop_perc * 100) / 100 + "%",
      sortDescFirst: true,
    },
  ];

  return (
    <>
      <Hero background="covidnow-banner">
        <div className="space-y-4">
          <span className="text-sm font-bold uppercase tracking-widest text-dim">
            {t("covidnow.title")}
          </span>
          <h3 className="text-black">{t("covidnow.title_header")}</h3>
          <p className="text-dim">{t("covidnow.title_description")}</p>

          <p className="text-sm text-dim">
            {t("common.last_updated", {
              date: DateTime.fromMillis(last_updated)
                .setLocale(router.locale ?? router.defaultLocale!)
                .toFormat("dd MMM yyyy, HH:mm"),
            })}
          </p>
        </div>
      </Hero>
      <Container className="min-h-screen">
        {/* Daily views on COVIDNOW */}
        <Section
          title={t("covidnow.combine_header")}
          description={t("covidnow.combine_description")}
          date={timeseries.data_as_of}
        >
          <div className="flex w-full flex-col gap-12">
            <div className="space-y-4">
              <Timeseries
                className="h-[350px] w-full pt-6"
                title={t("covidnow.combine_title")}
                // menu={<MenuDropdown />}
                stats={null}
                data={{
                  labels: filtered_timeline().x,
                  datasets: [
                    {
                      type: "line",
                      label: `${t("covidnow.combine_tooltip1")}`,
                      pointRadius: 0,
                      data: filtered_timeline().line,
                      borderColor: "#2563EB",
                      borderWidth: 1.5,
                    },
                    {
                      type: "bar",
                      label: `${t("covidnow.combine_tooltip2")}`,
                      data: filtered_timeline().y,
                      backgroundColor: "#D1D5DB",
                    },
                  ],
                }}
                enableGridX={false}
              />
              <Slider
                className="pt-7"
                type="range"
                data={timeseries.data.x}
                onChange={(item: any) => setLimit([item.min, item.max])}
              />
              <span className="text-sm text-dim">{t("common.slider")}</span>
            </div>
          </div>
        </Section>
        {/* World Map */}
        <Section
          title={t("covidnow.wmap_header")}
          description={t("covidnow.wmap_description")}
          date={choropleth_world.data_as_of}
        >
          <div>
            <Tabs className="flex flex-wrap justify-end gap-2" title={t("covidnow.wmap_title")}>
              <Panel key={0} name={`${t("covidnow.heatmap")}`}>
                <div className="grid grid-cols-1 ">
                  <ChoroplethWorld
                    className="h-[300px] w-auto lg:h-[510px] lg:w-full"
                    enableScale={false}
                    projectionScaleSetting={isMobile ? 65 : 110}
                    projectionTranslationSetting={isMobile ? [0.5, 0.75] : [0.5, 0.68]}
                    unitY={` ${t("covidnow.views").toLowerCase()}`}
                    xKey="properties.name_short"
                    data={choropleth_world.data.map((item: any) => {
                      return {
                        id: item.iso3,
                        value_real: item.data.views,
                        value: item.data.views_log ? item.data.views_log : 0,
                      };
                    })}
                  />
                </div>
              </Panel>
              <Panel key={1} name={`${t("covidnow.table")}`}>
                <div className="mx-auto max-w-screen-lg">
                  <Table
                    className="table-stripe table-default"
                    data={choropleth_world.data}
                    config={worldMapConfig}
                    enablePagination
                    enableSticky
                  />
                </div>
              </Panel>
            </Tabs>
          </div>
        </Section>

        {/* Malaysia Map */}
        <Section
          title={t("covidnow.mmap_header", { state: t("state.kvy") })}
          description={t("covidnow.mmap_description")}
          date={choropleth_malaysia.data_as_of}
          className={isMobile ? "border-b pt-12" : "border-b py-12"}
        >
          <div>
            <Tabs className="flex flex-wrap justify-end gap-2" title={t("covidnow.mmap_title")}>
              <Panel key={0} name={`${t("covidnow.heatmap")}`}>
                <div className="grid grid-cols-1 ">
                  <Choropleth
                    className={"h-[400px] w-auto lg:h-[500px] lg:w-full"}
                    enableScale={false}
                    // colorScale="CHOROPLETH_BLUE_SCALE"
                    colorScale="blues"
                    borderColor="#000"
                    borderWidth={0.5}
                    data={choropleth_malaysia.data.map((item: any) => ({
                      id: CountryAndStates[item.state],
                      state: CountryAndStates[item.state],
                      value: item.data.views_log,
                      value_real: item.data.views,
                    }))}
                    unitY={` ${t("covidnow.views").toLowerCase()}`}
                    graphChoice="state"
                  />
                </div>
              </Panel>
              <Panel key={1} name={`${t("covidnow.table")}`}>
                <div className="mx-auto max-w-screen-lg">
                  <Table
                    className="table-stripe table-default"
                    data={choropleth_malaysia.data}
                    config={malaysiaMapConfig}
                    enableSticky
                  />
                </div>
              </Panel>
            </Tabs>
          </div>
        </Section>

        {/* Heatmap */}
        <Section
          title={t("covidnow.heatmap_header")}
          description={t("covidnow.heatmap_description")}
          date={heatmap.data_as_of}
        >
          <div className="grid grid-cols-1 gap-12">
            <Heatmap
              className="flex h-[500px] w-[1500px] overflow-auto pt-7 lg:w-auto lg:overflow-visible"
              title={t("covidnow.heatmap_title")}
              //   menu={<MenuDropdown />}
              data={heatmap.data}
              axisLeft="default"
              unitY={` ${t("covidnow.views").toLowerCase()}`}
              valueFormat=" >-.2s"
              color="blues"
            />
          </div>
        </Section>

        {/* covidnow user demographic */}
        <Section
          title={t("covidnow.bar_header")}
          description={t("covidnow.bar_description")}
          date={barmeter.data_as_of}
        >
          <div className="grid grid-cols-1 gap-12 xl:grid-cols-3">
            <div className="w-full space-y-4">
              <BarMeter
                className="block space-y-2"
                data={barmeter.data.device_type}
                yKey="y"
                xKey="x"
                title={t("covidnow.bar_title1")}
                layout="horizontal"
                unit="%"
              />
            </div>
            <div className="w-full space-y-4">
              <BarMeter
                className="block space-y-2"
                data={barmeter.data.device_language}
                yKey="y"
                xKey="x"
                title={t("covidnow.bar_title2")}
                layout="horizontal"
                unit="%"
              />
            </div>

            <div className="w-full space-y-4">
              <BarMeter
                className="block space-y-2"
                data={barmeter.data.browser}
                yKey="y"
                xKey="x"
                title={t("covidnow.bar_title3")}
                layout="horizontal"
                unit="%"
              />
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-12 xl:grid-cols-3">
            <div className="w-full space-y-4">
              <BarMeter
                className="block space-y-2"
                data={barmeter.data.os}
                yKey="y"
                xKey="x"
                title={t("covidnow.bar_title4")}
                layout="horizontal"
                unit="%"
              />
            </div>
            <div className="w-full space-y-4">
              <BarMeter
                className="block space-y-2"
                data={barmeter.data.os_mobile}
                yKey="y"
                xKey="x"
                title={t("covidnow.bar_title5")}
                layout="horizontal"
                unit="%"
              />
            </div>
            <div className="w-full space-y-4">
              <BarMeter
                className="block space-y-2"
                data={barmeter.data.mobile_screensize}
                yKey="y"
                title={t("covidnow.bar_title6")}
                xKey="x"
                layout="horizontal"
                unit="%"
              />
            </div>
          </div>
        </Section>
      </Container>
    </>
  );
};

export default CovidNowDashboard;

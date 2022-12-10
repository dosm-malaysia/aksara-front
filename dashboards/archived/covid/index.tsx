import { Hero, Container, Tabs, Panel, StateDropdown, Tooltip, Section } from "@components/index";
import Image from "next/image";
import { FunctionComponent, useCallback } from "react";
import dynamic from "next/dynamic";
import { useData } from "@hooks/useData";
import { useRouter } from "next/router";
import { CountryAndStates, COVID_COLOR } from "@lib/constants";
import { routes } from "@lib/routes";
import { COVID_TABLE_SCHEMA } from "@lib/schema/covid";
import { filterCaseDeath } from "@lib/options";
import { useTranslation } from "next-i18next";
import { DateTime } from "luxon";

const BarMeter = dynamic(() => import("@components/Chart/BarMeter"), { ssr: false });
const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });
const Table = dynamic(() => import("@components/Chart/Table"), { ssr: false });
const Stages = dynamic(() => import("@components/Chart/Stages"), { ssr: false });
const DonutMeter = dynamic(() => import("@components/Chart/DonutMeter"), { ssr: false });

interface CovidDashboardProps {
  last_updated: number;
  bar_chart: any;
  snapshot_bar: any;
  snapshot_graphic: any;
  snapshot_table: any;
  timeseries_admitted: any;
  timeseries_cases: any;
  timeseries_deaths: any;
  timeseries_icu: any;
  timeseries_tests: any;
  timeseries_vents: any;
  util_chart: any;
  statistics: any;
}

const CovidDashboard: FunctionComponent<CovidDashboardProps> = ({
  last_updated,
  bar_chart,
  snapshot_bar,
  snapshot_graphic,
  snapshot_table,
  timeseries_admitted,
  timeseries_cases,
  timeseries_deaths,
  timeseries_icu,
  timeseries_tests,
  timeseries_vents,
  util_chart,
  statistics,
}) => {
  const router = useRouter();
  const currentState = (router.query.state as string) ?? "mys";
  const { t } = useTranslation("common");

  const { data, setData } = useData({
    show_indicator: {
      label: t(`covid.opt_${filterCaseDeath[0].value}`),
      value: filterCaseDeath[0].value,
    },
    filter_death: 0,
    filter_state: 0,
    filter_cases: 0,
    minmax: [timeseries_deaths.data.x.length - 182, timeseries_deaths.data.x.length - 1],
  });

  const filterTimeline = () => {
    return {
      x: timeseries_deaths.data.x.slice(data.minmax[0], data.minmax[1] + 1),
      deaths_line: timeseries_deaths.data.line.slice(data.minmax[0], data.minmax[1] + 1),
      deaths_inpatient: timeseries_deaths.data.deaths_inpatient.slice(
        data.minmax[0],
        data.minmax[1] + 1
      ),
      deaths_broughtin: timeseries_deaths.data.deaths_brought_in.slice(
        data.minmax[0],
        data.minmax[1] + 1
      ),
      vents_line: timeseries_vents.data.line.slice(data.minmax[0], data.minmax[1] + 1),
      vents_vent: timeseries_vents.data.vent.slice(data.minmax[0], data.minmax[1] + 1),
      icu_line: timeseries_icu.data.line.slice(data.minmax[0], data.minmax[1] + 1),
      icu_icu: timeseries_icu.data.icu.slice(data.minmax[0], data.minmax[1] + 1),
      admitted_line: timeseries_admitted.data.line.slice(data.minmax[0], data.minmax[1] + 1),
      admitted_admitted: timeseries_admitted.data.admitted.slice(
        data.minmax[0],
        data.minmax[1] + 1
      ),
      cases_line: timeseries_cases.data.line.slice(data.minmax[0], data.minmax[1] + 1),
      cases_cases: timeseries_cases.data.cases.slice(data.minmax[0], data.minmax[1] + 1),
      tests_posrate: timeseries_tests.data.tooltip.slice(data.minmax[0], data.minmax[1] + 1),
      tests_rtk: timeseries_tests.data.tests_rtk.slice(data.minmax[0], data.minmax[1] + 1),
      tests_pcr: timeseries_tests.data.tests_pcr.slice(data.minmax[0], data.minmax[1] + 1),
    };
  };

  const filtered_timeline = useCallback(filterTimeline, [
    data.minmax,
    timeseries_admitted,
    timeseries_cases,
    timeseries_deaths,
    timeseries_icu,
    timeseries_tests,
    timeseries_vents,
  ]);

  const BarTabsMenu = [
    {
      name: t("covid.tab_table2"),
      title: t("covid.tab_table2") + " per 100K",
      data: snapshot_bar.data.deaths,
    },
    {
      name: "Vent.",
      title: t("covid.utilisation_of", { param: "Vent." }).concat(" (%)"),
      data: snapshot_bar.data.util_vent,
      unit: "%",
    },
    {
      name: "ICU",
      title: t("covid.utilisation_of", { param: "ICU" }).concat(" (%)"),
      data: snapshot_bar.data.util_icu,
      unit: "%",
    },
    {
      name: "Hosp.",
      title: t("covid.utilisation_of", { param: "Hosp." }).concat(" (%)"),
      data: snapshot_bar.data.util_hosp,
      unit: "%",
    },
    {
      name: t("covid.tab_table4"),
      title: t("covid.tab_table4") + " per 100K",
      data: snapshot_bar.data.cases,
    },
  ];

  return (
    <>
      <Hero background="covid-banner">
        <div className="space-y-4 xl:w-2/3">
          <span className="text-sm font-bold uppercase tracking-widest text-dim">
            {t("covid.title")}
          </span>
          <h3 className="text-black">
            {t("covid.title_header", { state: CountryAndStates[currentState] })}
          </h3>
          <p className="text-dim">{t("covid.title_description1")}</p>
          <p className="text-dim">
            {t("covid.title_description2")}{" "}
            <a href="#" className="font-semibold text-blue-600">
              {" "}
              {t("covid.description_link")}
            </a>
          </p>

          <StateDropdown url={routes.COVID} currentState={currentState} exclude={["kvy"]} />

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
        {/* Utilisations */}
        <Section
          title={t("covid.donut_header")}
          description={
            <p className="pt-4 text-sm text-dim">
              {t("common.data_for", { state: CountryAndStates[currentState] })}
            </p>
          }
          date={util_chart.data_as_of}
        >
          <div className="grid grid-cols-2 gap-12 pt-6 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <DonutMeter value={util_chart.data.util_vent} />
              <div>
                <p className="text-dim">{t("covid.donut1")}</p>
                <Tooltip tip={t("covid.donut1_tooltips")}>
                  {open => (
                    <span
                      className="text-2xl font-medium underline decoration-dashed underline-offset-4"
                      onClick={() => open()}
                    >
                      {+util_chart.data.util_vent.toFixed(1)}%
                    </span>
                  )}
                </Tooltip>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DonutMeter value={util_chart.data.util_icu} />
              <div>
                <p className="text-dim">{t("covid.donut2")}</p>
                <Tooltip tip={t("covid.donut2_tooltips")}>
                  {open => (
                    <span
                      className="text-2xl font-medium underline decoration-dashed underline-offset-4"
                      onClick={() => open()}
                    >
                      {+util_chart.data.util_icu.toFixed(1)}%
                    </span>
                  )}
                </Tooltip>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DonutMeter value={util_chart.data.util_hosp} />
              <div>
                <p className="text-dim">{t("covid.donut3")}</p>
                <Tooltip tip={t("covid.donut3_tooltips")}>
                  {open => (
                    <span
                      className="text-2xl font-medium underline decoration-dashed underline-offset-4"
                      onClick={() => open()}
                    >
                      {+util_chart.data.util_hosp.toFixed(1)}%
                    </span>
                  )}
                </Tooltip>
              </div>
            </div>
            {util_chart.data.util_pkrc ? (
              <div className="flex items-center gap-3">
                <DonutMeter value={util_chart.data.util_pkrc} />
                <div>
                  <p className="text-dim">{t("covid.donut4")}</p>
                  <Tooltip tip={t("covid.donut4_tooltips")}>
                    {open => (
                      <span
                        className="text-2xl font-medium underline decoration-dashed underline-offset-4"
                        onClick={() => open()}
                      >
                        {util_chart.data.util_pkrc && +util_chart.data.util_pkrc.toFixed(1)}%
                      </span>
                    )}
                  </Tooltip>
                </div>
              </div>
            ) : undefined}
          </div>
        </Section>

        {/* What does the latest data show? */}
        <Section title={t("covid.diagram_header")} date={snapshot_graphic.data_as_of}>
          <div className="grid grid-cols-1 gap-12 pb-6 lg:grid-cols-2 xl:grid-cols-3">
            <div className="col-span-1 xl:col-span-2">
              <Stages
                title={t("covid.diagram_subheader")}
                className="h-full pt-4"
                state={currentState}
                // menu={<MenuDropdown />}
                data={{
                  header: {
                    name: `${t("covid.diagram_title")}`,
                    value: snapshot_graphic.data.cases_active,
                    delta: snapshot_graphic.data.cases_active_annot,
                    inverse: true,
                  },
                  col_1: [
                    {
                      name: `${t("covid.col1_title1")}`,
                      value: snapshot_graphic.data.cases_local,
                      delta: snapshot_graphic.data.cases_local_annot,
                      inverse: true,
                      icon: (
                        <Image
                          src="/static/images/stages/virus.svg"
                          height={32}
                          width={32}
                          alt="Local Cases"
                        />
                      ),
                    },
                    {
                      name: `${t("covid.col1_title2")}`,
                      value: snapshot_graphic.data.cases_import,
                      delta: snapshot_graphic.data.cases_import_annot,
                      inverse: true,
                    },
                  ],
                  col_2: [
                    {
                      name: `${t("covid.col2_title1")}`,
                      value: snapshot_graphic.data.home,
                      delta: snapshot_graphic.data.home_annot,
                      unit: "%",
                      icon: (
                        <Image
                          src="/static/images/stages/home-quarantine.svg"
                          height={32}
                          width={32}
                          alt="Home Quarantine"
                        />
                      ),
                    },
                    {
                      name: `${t("covid.col2_title2")}`,
                      value: snapshot_graphic.data.pkrc,
                      delta: snapshot_graphic.data.pkrc_annot,
                      unit: "%",
                      icon: (
                        <Image
                          src="/static/images/stages/pkrc.svg"
                          height={32}
                          width={32}
                          alt="PKRC"
                        />
                      ),
                    },
                    {
                      name: `${t("covid.col2_title3")}`,
                      value: snapshot_graphic.data.hosp,
                      delta: snapshot_graphic.data.hosp_annot,
                      unit: "%",
                      icon: (
                        <Image
                          src="/static/images/stages/hospitalised.svg"
                          height={32}
                          width={32}
                          alt="Hospitalised"
                        />
                      ),
                    },
                    {
                      name: `${t("covid.col2_title4")}`,
                      value: snapshot_graphic.data.icu,
                      delta: snapshot_graphic.data.icu_annot,
                      unit: "%",
                      icon: (
                        <Image
                          src="/static/images/stages/icu-unventilated.svg"
                          height={32}
                          width={32}
                          alt="ICU (Unventilated)"
                        />
                      ),
                    },
                    {
                      name: `${t("covid.col2_title5")}`,
                      value: snapshot_graphic.data.vent,
                      delta: snapshot_graphic.data.vent_annot,
                      unit: "%",
                      icon: (
                        <Image
                          src="/static/images/stages/icu-ventilated.svg"
                          height={32}
                          width={32}
                          alt="ICU (Ventilated)"
                        />
                      ),
                    },
                  ],
                  col_3: [
                    {
                      name: `${t("covid.col3_title1")}`,
                      value: snapshot_graphic.data.cases_recovered,
                      delta: snapshot_graphic.data.cases_recovered_annot,
                      icon: (
                        <Image
                          src="/static/images/stages/recovered.svg"
                          height={32}
                          width={32}
                          alt="Recovered"
                        />
                      ),
                    },
                    {
                      name: `${t("covid.col3_title2")}`,
                      value: snapshot_graphic.data.deaths,
                      delta: snapshot_graphic.data.deaths_annot,
                      inverse: true,
                      icon: (
                        <Image
                          src="/static/images/stages/death.svg"
                          height={32}
                          width={32}
                          alt="Deaths (Including BID)"
                        />
                      ),
                    },
                    {
                      name: `${t("covid.col3_title3")}`,
                      value: snapshot_graphic.data.deaths_bid,
                      delta: snapshot_graphic.data.deaths_bid_annot,
                      inverse: true,
                    },
                  ],
                }}
              />
            </div>
            <div className="col-span-1">
              <Tabs
                title={BarTabsMenu[data.filter_state].title}
                className="w-full"
                onChange={value => setData("filter_state", value)}
              >
                {BarTabsMenu.map(({ name, data, unit }, index) => {
                  return (
                    <Panel key={index} name={name}>
                      {/* <BarMeter
                        className="block w-full space-y-2 pt-4"
                        data={data}
                        yKey="y"
                        xKey="x"
                        layout="state-horizontal"
                        relative
                        sort="desc"
                        unit={unit}
                      /> */}
                    </Panel>
                  );
                })}
              </Tabs>
            </div>
          </div>
        </Section>

        {/* How are COVID-19 key indicators trending */}
        <Section title={t("covid.area_chart_header")} date={timeseries_deaths.data_as_of}>
          <div className="grid grid-cols-1 gap-12 pb-6 lg:grid-cols-2 xl:grid-cols-3">
            <Timeseries
              className="h-[250px] w-full"
              title={t("covid.area_chart_title1")}
              state={currentState}
              // menu={<MenuDropdown />}
              stats={[
                {
                  title: t("covid.deaths.annot1"),
                  value: statistics.data.deaths.annot1.toLocaleString(),
                },
                {
                  title: t("covid.deaths.annot2"),
                  value: statistics.data.deaths.annot2.toLocaleString(),
                },
              ]}
              // enableLegend
              data={{
                labels: filtered_timeline().x,
                datasets: [
                  {
                    type: "line",
                    label: `${t("covid.area_chart_tooltip1")}`,
                    pointRadius: 0,
                    data: filtered_timeline().deaths_line,
                    borderColor: "#0F172A",
                    borderWidth: 1.5,
                  },
                  {
                    type: "bar",
                    label: `${t("covid.area_chart_tooltip2")}`,
                    data: filtered_timeline().deaths_inpatient,
                    backgroundColor: COVID_COLOR[200],
                    stack: "same",
                  },
                  {
                    type: "bar",
                    label: `${t("covid.area_chart_tooltip3")}`,
                    data: filtered_timeline().deaths_broughtin,
                    backgroundColor: COVID_COLOR[100],
                    stack: "same",
                  },
                ],
              }}
              enableGridX={false}
            />
            <Timeseries
              className="h-[250px] w-full"
              title={t("covid.area_chart_title2")}
              state={currentState}
              // menu={<MenuDropdown />}
              stats={[
                {
                  title: t("covid.vent.annot1"),
                  value: statistics.data.vent.annot1.toLocaleString(),
                },
                {
                  title: t("covid.vent.annot2"),
                  value: (+statistics.data.vent.annot2.toFixed(1)).toLocaleString().concat("%"),
                },
              ]}
              // enableLegend
              data={{
                labels: filtered_timeline().x,
                datasets: [
                  {
                    type: "line",
                    label: `${t("covid.area_chart2_tooltip1")}`,
                    pointRadius: 0,
                    data: filtered_timeline().vents_line,
                    borderColor: COVID_COLOR[300],
                    borderWidth: 1.5,
                  },
                  {
                    type: "bar",
                    label: `${t("covid.area_chart2_tooltip2")}`,
                    data: filtered_timeline().vents_vent,
                    backgroundColor: COVID_COLOR[100],
                    stack: "same",
                  },
                ],
              }}
              enableGridX={false}
            />
            <Timeseries
              className="h-[250px] w-full"
              title={t("covid.area_chart_title3")}
              state={currentState}
              // menu={<MenuDropdown />}
              stats={[
                {
                  title: t("covid.icu.annot1"),
                  value: statistics.data.icu.annot1.toLocaleString(),
                },
                {
                  title: t("covid.icu.annot2"),
                  value: (+statistics.data.icu.annot2.toFixed(1)).toLocaleString().concat("%"),
                },
              ]}
              // enableLegend
              data={{
                labels: filtered_timeline().x,
                datasets: [
                  {
                    type: "line",
                    label: `${t("covid.area_chart3_tooltip1")}`,
                    pointRadius: 0,
                    data: filtered_timeline().icu_line,
                    borderColor: COVID_COLOR[300],
                    borderWidth: 1.5,
                  },
                  {
                    type: "bar",
                    label: `${t("covid.area_chart3_tooltip2")}`,
                    data: filtered_timeline().icu_icu,
                    backgroundColor: COVID_COLOR[100],
                    stack: "same",
                  },
                ],
              }}
              enableGridX={false}
            />
            <Timeseries
              className="h-[250px] w-full"
              title={t("covid.area_chart_title4")}
              state={currentState}
              // menu={<MenuDropdown />}
              stats={[
                {
                  title: t("covid.admitted.annot1"),
                  value: statistics.data.admitted.annot1.toLocaleString(),
                },
                {
                  title: t("covid.admitted.annot2"),
                  value: (+statistics.data.admitted.annot2.toFixed(1)).toLocaleString().concat("%"),
                },
              ]}
              // enableLegend
              data={{
                labels: filtered_timeline().x,
                datasets: [
                  {
                    type: "line",
                    label: `${t("covid.area_chart4_tooltip1")}`,
                    pointRadius: 0,
                    data: filtered_timeline().admitted_line,
                    borderColor: COVID_COLOR[300],
                    borderWidth: 1.5,
                  },
                  {
                    type: "bar",
                    label: `${t("covid.area_chart4_tooltip2")}`,
                    data: filtered_timeline().admitted_admitted,
                    backgroundColor: COVID_COLOR[100],
                    stack: "same",
                  },
                ],
              }}
              enableGridX={false}
            />
            <Timeseries
              className="h-[250px] w-full"
              title={t("covid.area_chart_title5")}
              state={currentState}
              // menu={<MenuDropdown />}
              // enableLegend
              stats={[
                {
                  title: t("covid.cases.annot1"),
                  value: statistics.data.cases.annot1.toLocaleString(),
                },
                {
                  title: t("covid.cases.annot2"),
                  value: statistics.data.cases.annot2.toLocaleString(),
                },
              ]}
              data={{
                labels: filtered_timeline().x,
                datasets: [
                  {
                    type: "line",
                    label: `${t("covid.area_chart5_tooltip1")}`,
                    pointRadius: 0,
                    data: filtered_timeline().cases_line,
                    borderColor: COVID_COLOR[300],
                    borderWidth: 1.5,
                  },
                  {
                    type: "bar",
                    label: `${t("covid.area_chart5_tooltip2")}`,
                    data: filtered_timeline().cases_cases,
                    backgroundColor: COVID_COLOR[100],
                    stack: "same",
                  },
                ],
              }}
              enableGridX={false}
            />
            <Timeseries
              className="h-[250px] w-full"
              title={t("covid.area_chart_title6")}
              state={currentState}
              // menu={<MenuDropdown />}
              stats={[
                {
                  title: t("covid.tests.annot1"),
                  value: statistics.data.tests.annot1.toLocaleString(),
                },
                {
                  title: t("covid.tests.annot2"),
                  value: (+statistics.data.tests.annot2.toFixed(1)).toLocaleString().concat("%"),
                },
              ]}
              enableRightScale
              data={{
                labels: filtered_timeline().x,
                datasets: [
                  {
                    type: "line",
                    label: `${t("covid.area_chart6_tooltip1")}`,
                    pointRadius: 0,
                    borderColor: "#0F172A",
                    data: filtered_timeline().tests_posrate,
                    borderWidth: 1.5,
                    yAxisID: "y1",
                    spanGaps: true,
                  },
                  {
                    type: "bar",
                    label: `${t("covid.area_chart6_tooltip2")}`,
                    data: filtered_timeline().tests_rtk,
                    backgroundColor: COVID_COLOR[200],
                    stack: "same",
                  },
                  {
                    type: "bar",
                    label: `${t("covid.area_chart6_tooltip3")}`,
                    data: filtered_timeline().tests_pcr,
                    backgroundColor: COVID_COLOR[100],
                    stack: "same",
                  },
                ],
              }}
              enableGridX={false}
            />
          </div>
          <div>
            {/* <Slider
              className="pt-7"
              type="range"
              data={timeseries_deaths.data.x}
              value={data.minmax}
              onChange={item => setData("minmax", item)}
            /> */}
            <span className="text-sm text-dim">{t("common.slider")}</span>
          </div>
        </Section>

        {/* How vaccinated against COVID-19 are we? */}
        <Section title={t("covid.table_header")} date={snapshot_table.data_as_of}>
          <div>
            <Tabs
              className="flex flex-wrap justify-end gap-2 pb-4"
              title={t("covid.table_subheader")}
            >
              {COVID_TABLE_SCHEMA().map((menu, index) => {
                return (
                  <Panel key={index} name={menu.name}>
                    <Table data={snapshot_table.data} config={menu.config} enableSticky />
                  </Panel>
                );
              })}
            </Tabs>
          </div>
        </Section>

        {/* How is vaccination influencing key epidemic indidcators? */}
        {/* <Section
          title={t("covid.bar_chart_header")}
          description={t("covid.bar_chart_subheader")}
          date={bar_chart.data_as_of}
        >
          <Tabs
            title={
              {
                cases:
                  data.filter_cases === 0
                    ? `${t("covid.bar_chart_cases1")}`
                    : `${t("covid.bar_chart_cases2")}`,
                deaths:
                  data.filter_deaths === 0
                    ? `${t("covid.bar_chart_Deaths1")}`
                    : `${t("covid.bar_chart_Deaths2")}`,
              }[data.show_indicator.value as string]
            }
            state={currentState}
            controls={
              <Dropdown
                options={filterCaseDeath.map(option => {
                  return {
                    label: t(`covid.opt_${option.value}`),
                    value: option.value,
                  };
                })}
                selected={data.show_indicator}
                onChange={e => setData("show_indicator", e)}
              />
            }
            onChange={value => setData("filter_death", value)}
          >
            <Panel name={t("covid.bar_chart1_type")}>
              <>
                {
                  {
                    cases: (
                      <Bar
                        className="h-[450px]"
                        data={{
                          labels: bar_chart.data.cases.capita.x,
                          datasets: [
                            {
                              label: `${t("covid.bar_chart2_label1")}`,
                              data: bar_chart.data.cases.capita.unvax,
                              backgroundColor: COVID_COLOR[100],
                              stack: "1",
                            },
                            {
                              label: `${t("covid.bar_chart2_label2")}`,
                              data: bar_chart.data.cases.capita.partialvax,
                              backgroundColor: COVID_COLOR[200],
                              stack: "2",
                            },
                            {
                              label: `${t("covid.bar_chart2_label3")}`,
                              data: bar_chart.data.cases.capita.fullvax,
                              backgroundColor: COVID_COLOR[300],
                              stack: "3",
                            },
                            {
                              label: `${t("covid.bar_chart2_label4")}`,
                              data: bar_chart.data.cases.capita.boosted,
                              backgroundColor: COVID_COLOR[300],
                              stack: "4",
                            },
                          ],
                        }}
                        // enableLegend
                        enableGridX={false}
                      />
                    ),
                    deaths: (
                      <Bar
                        className="h-[450px]"
                        data={{
                          labels: bar_chart.data.deaths.capita.x,
                          datasets: [
                            {
                              label: `${t("covid.bar_chart2_label1")}`,
                              data: bar_chart.data.deaths.capita.unvax,
                              backgroundColor: COVID_COLOR[100],
                              stack: "1",
                            },
                            {
                              label: `${t("covid.bar_chart2_label2")}`,
                              data: bar_chart.data.deaths.capita.partialvax,
                              backgroundColor: COVID_COLOR[200],
                              stack: "2",
                            },
                            {
                              label: `${t("covid.bar_chart2_label3")}`,
                              data: bar_chart.data.deaths.capita.fullvax,
                              backgroundColor: COVID_COLOR[300],
                              stack: "3",
                            },
                            {
                              label: `${t("covid.bar_chart2_label4")}`,
                              data: bar_chart.data.deaths.capita.boosted,
                              backgroundColor: COVID_COLOR[300],
                              stack: "4",
                            },
                          ],
                        }}
                        // enableLegend
                        enableGridX={false}
                      />
                    ),
                  }[data.show_indicator.value as string]
                }
              </>
            </Panel>
            <Panel name={t("covid.bar_chart2_type")}>
              <>
                {
                  {
                    cases: (
                      <Bar
                        className="h-[450px]"
                        data={{
                          labels: bar_chart.data.cases.abs.x,
                          datasets: [
                            {
                              label: `${t("covid.bar_chart2_label1")}`,
                              data: bar_chart.data.cases.abs.unvax,
                              backgroundColor: COVID_COLOR[100],
                              stack: "1",
                            },
                            {
                              label: `${t("covid.bar_chart2_label2")}`,
                              data: bar_chart.data.cases.abs.partialvax,
                              backgroundColor: COVID_COLOR[200],
                              stack: "2",
                            },
                            {
                              label: `${t("covid.bar_chart2_label3")}`,
                              data: bar_chart.data.cases.abs.fullvax,
                              backgroundColor: COVID_COLOR[300],
                              stack: "3",
                            },
                            {
                              label: `${t("covid.bar_chart2_label4")}`,
                              data: bar_chart.data.cases.abs.boosted,
                              backgroundColor: COVID_COLOR[300],
                              stack: "4",
                            },
                          ],
                        }}
                        // enableLegend
                        enableGridX={false}
                      />
                    ),
                    deaths: (
                      <Bar
                        className="h-[450px]"
                        data={{
                          labels: bar_chart.data.deaths.abs.x,
                          datasets: [
                            {
                              label: `${t("covid.bar_chart2_label1")}`,
                              data: bar_chart.data.deaths.abs.unvax,
                              backgroundColor: COVID_COLOR[100],
                              stack: "1",
                            },
                            {
                              label: `${t("covid.bar_chart2_label2")}`,
                              data: bar_chart.data.deaths.abs.partialvax,
                              backgroundColor: COVID_COLOR[200],
                              stack: "2",
                            },
                            {
                              label: `${t("covid.bar_chart2_label3")}`,
                              data: bar_chart.data.deaths.abs.fullvax,
                              backgroundColor: COVID_COLOR[300],
                              stack: "3",
                            },
                            {
                              label: `${t("covid.bar_chart2_label4")}`,
                              data: bar_chart.data.deaths.abs.boosted,
                              backgroundColor: COVID_COLOR[300],
                              stack: "4",
                            },
                          ],
                        }}
                        // enableLegend
                        enableGridX={false}
                      />
                    ),
                  }[data.show_indicator.value as string]
                }
              </>
            </Panel>
          </Tabs>
        </Section> */}
      </Container>
    </>
  );
};

export default CovidDashboard;

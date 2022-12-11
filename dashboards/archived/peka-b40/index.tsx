import { FunctionComponent, useCallback } from "react";
import { Hero, Container, Section, StateDropdown } from "@components/index";
import dynamic from "next/dynamic";
import { useData } from "@hooks/useData";
import { useWindowWidth } from "@hooks/useWindowWidth";

import { GRAYBAR_COLOR, PEKA_COLOR, CountryAndStates, BREAKPOINTS } from "@lib/constants";
import { useRouter } from "next/router";
import { routes } from "@lib/routes";
import { useTranslation } from "next-i18next";
import { DateTime } from "luxon";

const Bar = dynamic(() => import("@components/Chart/Bar"), { ssr: false });
const Heatmap = dynamic(() => import("@components/Chart/Heatmap"), { ssr: false });
const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });
const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });

interface PekaB40DashboardProps {
  last_updated: number;
  timeseries_screenrate: any;
  heatmap_screenrate: any;
  bar_age: any;
  choropleth_malaysia_peka_b40: any;
}

const PekaB40Dashboard: FunctionComponent<PekaB40DashboardProps> = ({
  last_updated,
  timeseries_screenrate,
  heatmap_screenrate,
  bar_age,
  choropleth_malaysia_peka_b40,
}) => {
  const router = useRouter();
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < BREAKPOINTS.MD;
  const currentState = (router.query.state as string) ?? "mys";
  const { data, setData } = useData({
    minmax: [timeseries_screenrate.data.x.length - 182, timeseries_screenrate.data.x.length - 1],
  });

  const { t } = useTranslation("common");

  const filtered_timeline = useCallback(() => {
    return {
      x: timeseries_screenrate.data.x.slice(data.minmax[0], data.minmax[1] + 1),
      line: timeseries_screenrate.data.line.slice(data.minmax[0], data.minmax[1] + 1),
      daily: timeseries_screenrate.data.daily.slice(data.minmax[0], data.minmax[1] + 1),
    };
  }, [data.minmax, timeseries_screenrate]);

  return (
    <>
      <Hero background="peka-banner">
        <div className="space-y-4 xl:w-2/3">
          <span className="text-sm font-bold uppercase tracking-widest text-dim">
            {t("peka.title")}
          </span>
          <h3 className="text-black">{t("peka.title_header")}</h3>
          <p className="text-dim">
            {t("peka.title_description")}{" "}
            <a href="#" className="font-semibold text-blue-600">
              {t("peka.title_link")}
            </a>
            {t("peka.title_description2")}
          </p>
          {/* <div className="flex w-full items-center gap-4">
            <p className="text-sm font-bold text-dim">{t("covid.zoom")}</p> */}
          <StateDropdown url={routes.PEKA_B40} currentState={currentState} exclude={["kvy"]} />
          {/* </div> */}

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
        <Section
          title={t("peka.screening_header", { state: CountryAndStates[currentState] })}
          description={
            <p className="pt-2 text-dim">
              {t("peka.screening_description1")} <strong>{t("peka.screening_description2")}</strong>
              {t("peka.screening_description3")}
            </p>
          }
          date={timeseries_screenrate.data_as_of}
        >
          <div className="space-y-4">
            <Timeseries
              title={t("peka.timeseries_title")}
              className="h-[350px]"
              state={currentState}
              data={{
                labels: filtered_timeline().x,
                datasets: [
                  {
                    type: "line",
                    label: t("peka.timeseries_line"),
                    data: filtered_timeline().line,
                    borderColor: PEKA_COLOR[600],
                    borderWidth: 1.5,
                  },
                  {
                    type: "bar",
                    label: t("peka.timeseries_bar"),
                    data: filtered_timeline().daily,
                    backgroundColor: GRAYBAR_COLOR[100],
                  },
                ],
              }}
              stats={null}
            />
            {/* <Slider
              className="pt-7"
              type="range"
              value={data.minmax}
              data={timeseries_screenrate.data.x}
              onChange={item => setData("minmax", item)}
            /> */}
            <span className="text-sm text-dim">{t("common.slider")}</span>
          </div>
        </Section>
        {/* Choropleth view of pekaB40 in Malaysia */}
        <Section
          title={t("peka.choro_header")}
          description={t("peka.choro_description")}
          date={choropleth_malaysia_peka_b40.data_as_of}
          className={isMobile ? "border-b pt-12" : "border-b py-12"}
        >
          <div>
            <Choropleth
              className={isMobile ? "h-[400px] w-auto" : "h-[500px] w-full"}
              enableScale={false}
              colorScale="purples"
              borderColor="#000"
              borderWidth={0.5}
              data={choropleth_malaysia_peka_b40.data.map((item: any) => ({
                id: CountryAndStates[item.state],
                state: CountryAndStates[item.state],
                value: item.data.perc,
              }))}
              unitY="%"
              graphChoice="state"
            />
          </div>
        </Section>
        {/* What proportion of the population in {{ area }} donates blood? */}
        {/* <Section
          title={t("peka.heatmap_header", { state: CountryAndStates[currentState] })}
          description={t("peka.heatmap_description")}
          date={heatmap_screenrate.data_as_of}
        >
          <div className="grid grid-cols-1 gap-12 xl:grid-cols-2">
            <div className="w-full">
              <Tabs
                title={t("peka.heatmap_title")}
                //menu={<MenuDropdown />}
                state={currentState}
              >
                <Panel name={t("peka.heatmap_panel1")}>
                  <>
                    <Heatmap
                      className="flex h-[140px] overflow-visible"
                      data={[
                        heatmap_screenrate.data.capita.male,
                        heatmap_screenrate.data.capita.female,
                      ]}
                      subdata
                      axisLeft="default"
                      color="red_purple"
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
                      title="Male"
                      data={[
                        heatmap_screenrate.data.capita.male_chinese,
                        heatmap_screenrate.data.capita.male_indian,
                        heatmap_screenrate.data.capita.male_bumi,
                        heatmap_screenrate.data.capita.male_other,
                      ]}
                      subdata
                      axisLeft="default"
                      axisTop={null}
                      color="red_purple"
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
                      title="Female"
                      data={[
                        heatmap_screenrate.data.capita.female_chinese,
                        heatmap_screenrate.data.capita.female_indian,
                        heatmap_screenrate.data.capita.female_bumi,
                        heatmap_screenrate.data.capita.female_other,
                      ]}
                      subdata
                      axisLeft="default"
                      axisTop={null}
                      color="red_purple"
                    />
                  </>
                </Panel>
                <Panel name={t("peka.heatmap_panel2")}>
                  <>
                    <Heatmap
                      className="flex h-[150px] overflow-auto lg:overflow-visible"
                      data={[
                        heatmap_screenrate.data.perc.male,
                        heatmap_screenrate.data.perc.female,
                      ]}
                      subdata
                      axisLeft="default"
                      unitY="%"
                      color="red_purple"
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
                      title="Male"
                      data={[
                        heatmap_screenrate.data.perc.male_chinese,
                        heatmap_screenrate.data.perc.male_indian,
                        heatmap_screenrate.data.perc.male_bumi,
                        heatmap_screenrate.data.perc.male_other,
                      ]}
                      subdata
                      unitY="%"
                      axisLeft="default"
                      axisTop={null}
                      color="red_purple"
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
                      title="Female"
                      data={[
                        heatmap_screenrate.data.perc.female_chinese,
                        heatmap_screenrate.data.perc.female_indian,
                        heatmap_screenrate.data.perc.female_bumi,
                        heatmap_screenrate.data.perc.female_other,
                      ]}
                      subdata
                      unitY="%"
                      axisLeft="default"
                      axisTop={null}
                      color="red_purple"
                    />
                  </>
                </Panel>
                <Panel name={t("peka.heatmap_panel3")}>
                  <>
                    <Heatmap
                      className="flex h-[150px] overflow-visible"
                      data={[heatmap_screenrate.data.abs.male, heatmap_screenrate.data.abs.female]}
                      subdata
                      axisLeft="default"
                      valueFormat="<-,.1~s"
                      color="red_purple"
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
                      title="Male"
                      data={[
                        heatmap_screenrate.data.abs.male_chinese,
                        heatmap_screenrate.data.abs.male_indian,
                        heatmap_screenrate.data.abs.male_bumi,
                        heatmap_screenrate.data.abs.male_other,
                      ]}
                      subdata
                      valueFormat="<-,.2~s"
                      axisLeft="default"
                      axisTop={null}
                      color="red_purple"
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
                      title="Female"
                      data={[
                        heatmap_screenrate.data.abs.female_chinese,
                        heatmap_screenrate.data.abs.female_indian,
                        heatmap_screenrate.data.abs.female_bumi,
                        heatmap_screenrate.data.abs.female_other,
                      ]}
                      subdata
                      valueFormat="<-,.1~s"
                      axisLeft="default"
                      axisTop={null}
                      color="red_purple"
                    />
                  </>
                </Panel>
              </Tabs>
            </div>

            <div>
              <Tabs title={t("peka.bar2_x")} state={currentState}>
                <Panel name={t("peka.annual")}>
                  <Bar
                    className="h-[500px]"
                    layout="horizontal"
                    data={{
                      labels: bar_age.data.last_year.x,
                      datasets: [
                        {
                          label: t("peka.screening"),
                          data: bar_age.data.last_year.y,
                          backgroundColor: GRAYBAR_COLOR[100],
                        },
                      ],
                    }}
                    enableGridY={false}
                  />
                </Panel>
                <Panel name={t("peka.monthly")}>
                  <Bar
                    className="h-[500px]"
                    layout="horizontal"
                    data={{
                      labels: bar_age.data.last_year.x,
                      datasets: [
                        {
                          label: t("peka.screening"),
                          data: bar_age.data.last_year.y,
                          backgroundColor: GRAYBAR_COLOR[100],
                        },
                      ],
                    }}
                    enableGridY={false}
                  />
                </Panel>
              </Tabs>
            </div>
          </div>
        </Section> */}
        {/* // How is this data collected?  */}
        {/* <Section title={t("peka.map_header")} description={t("peka.map_description")} /> */}
      </Container>
    </>
  );
};

export default PekaB40Dashboard;

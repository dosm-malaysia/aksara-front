import {
  Hero,
  Container,
  Tabs,
  Panel,
  Tooltip,
  Section,
  Slider,
  StateDropdown,
  Dropdown,
  Button,
  BarMeter,
} from "@components/index";
import { useData } from "@hooks/useData";
import { useWindowWidth } from "@hooks/useWindowWidth";

import {
  BLOOD_SUPPLY_COLOR,
  BLOOD_COLOR,
  GRAYBAR_COLOR,
  CountryAndStates,
  BREAKPOINTS,
} from "@lib/constants";
import { BLOOD_SUPPLY_SCHEMA } from "@lib/schema/blood-donation";
import { routes } from "@lib/routes";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FunctionComponent, useCallback, useState, useMemo } from "react";
import { useTranslation } from "next-i18next";
import { ArrowPathIcon, MapPinIcon } from "@heroicons/react/24/solid";
import { DateTime } from "luxon";

const Bar = dynamic(() => import("@components/Chart/Bar"), { ssr: false });
const Empty = dynamic(() => import("@components/Chart/Empty"), { ssr: false });
const Heatmap = dynamic(() => import("@components/Chart/Heatmap"), { ssr: false });
const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });
const OSMapWrapper = dynamic(() => import("@components/OSMapWrapper"), { ssr: false });
const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });

interface BloodDonationDashboardProps {
  last_updated: number;
  timeseries_all: any;
  timeseries_bloodstock: any;
  timeseries_facility: any;
  heatmap_bloodstock: any;
  heatmap_donorrate: any;
  heatmap_retention: any;
  barchart_age: any;
  barchart_time: any;
  barchart_variables: any;
  map_facility: any;
  choropleth_malaysia_blood_donation: any;
}

const BloodDonationDashboard: FunctionComponent<BloodDonationDashboardProps> = ({
  last_updated,
  timeseries_all,
  timeseries_bloodstock,
  timeseries_facility,
  heatmap_bloodstock,
  heatmap_donorrate,
  heatmap_retention,
  barchart_age,
  barchart_time,
  barchart_variables,
  map_facility,
  choropleth_malaysia_blood_donation,
}) => {
  const router = useRouter();
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < BREAKPOINTS.MD;
  const currentState = (router.query.state as string) ?? "mys";
  const { data, setData } = useData({
    absolute_donation_type: false,
    absolute_blood_group: false,
    absolute_donor_type: false,
    absolute_location: false,
    zoom_state: currentState === "mys" ? undefined : currentState,
    zoom_facility: undefined,
    minmax: [timeseries_all.data.x.length - 182, timeseries_all.data.x.length - 1],
  });
  const { t } = useTranslation("common");

  const filterTimeline = () => {
    return {
      x: timeseries_all.data.x.slice(data.minmax[0], data.minmax[1] + 1),
      daily: timeseries_all.data.daily.slice(data.minmax[0], data.minmax[1] + 1),
      line_daily: timeseries_all.data.line_daily.slice(data.minmax[0], data.minmax[1] + 1),
    };
  };

  const filtered_timeline = useCallback(filterTimeline, [data.minmax, timeseries_all]);

  const handleClearSelection = () => {
    setData("zoom_state", undefined);
    setData("zoom_facility", undefined);
  };

  const KEY_VARIABLES_SCHEMA = [
    {
      name: t("blood.yesterday"),
      data: barchart_variables.data.yesterday,
    },
    {
      name: t("blood.month"),
      data: barchart_variables.data.past_month,
    },
    {
      name: t("blood.year"),
      data: barchart_variables.data.past_year,
    },
  ];

  return (
    <>
      <Hero background="blood-banner">
        <div className="space-y-4 xl:w-2/3">
          <span className="text-sm font-bold uppercase tracking-widest text-dim">
            {t("blood.title")}
          </span>
          <h3 className="text-black">{t("blood.title_header")}</h3>
          <p className="text-dim">
            {t("blood.title_description")}{" "}
            <a href="#" className="font-semibold text-blue-600">
              {t("blood.title_link")}
            </a>
          </p>

          <StateDropdown
            url={routes.BLOOD_DONATION}
            currentState={currentState}
            exclude={["pjy", "pls", "lbn", "kvy"]}
          />

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
        {/* Is {{ area }}'s current blood supply sufficient? */}
        {/* <Section
          title={t("blood.table_header", { state: CountryAndStates[currentState] })}
          date={heatmap_bloodstock.data_as_of}
        >
          <div className="grid grid-cols-1 gap-12 xl:grid-cols-2 ">
            <Heatmap
              className="h-[420px] w-[600px]"
              title={t("blood.table_title")}
              hoverTarget="row"
              data={heatmap_bloodstock.data}
              axisLeft="state"
              schema={BLOOD_SUPPLY_SCHEMA()}
              color={BLOOD_SUPPLY_COLOR}
              //menu={<MenuDropdown />}
            />
            <div>
              <Tabs
                title={
                  <Tooltip
                    trigger={open => (
                      <span
                        className="font-bold underline decoration-dashed underline-offset-4"
                        onClick={() => open()}
                      >
                        {t("blood.area_title")}
                      </span>
                    )}
                  >
                    {t("blood.area_tooltip")}
                  </Tooltip>
                }
                state={currentState}
                //menu={<MenuDropdown />}
              >
                <Panel name={t("blood.area_type1")}>
                  <Timeseries
                    className="h-[350px] w-full"
                    interval="week"
                    data={{
                      labels: timeseries_bloodstock.data.x,
                      datasets: [
                        {
                          type: "line",
                          label: `${t("blood.area_type1")}`,
                          pointRadius: 0,
                          data: timeseries_bloodstock.data.type_a,
                          backgroundColor: BLOOD_COLOR[100],
                          fill: true,
                          borderWidth: 0,
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
                <Panel name={t("blood.area_type2")}>
                  <Timeseries
                    className="h-[350px] w-full"
                    interval="week"
                    data={{
                      labels: timeseries_bloodstock.data.x,
                      datasets: [
                        {
                          type: "line",
                          label: `${t("blood.area_type2")}`,
                          pointRadius: 0,
                          data: timeseries_bloodstock.data.type_b,
                          backgroundColor: BLOOD_COLOR[200],
                          fill: true,
                          borderWidth: 0,
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
                <Panel name={t("blood.area_type3")}>
                  <Timeseries
                    className="h-[350px] w-full"
                    interval="week"
                    data={{
                      labels: timeseries_bloodstock.data.x,
                      datasets: [
                        {
                          type: "line",
                          label: `${t("blood.area_type3")}`,
                          pointRadius: 0,
                          data: timeseries_bloodstock.data.type_ab,
                          backgroundColor: BLOOD_COLOR[300],
                          fill: true,
                          borderWidth: 0,
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
                <Panel name={t("blood.area_type3")}>
                  <Timeseries
                    className="h-[350px] w-full"
                    interval="week"
                    data={{
                      labels: timeseries_bloodstock.data.x,
                      datasets: [
                        {
                          type: "line",
                          label: `${t("blood.area_type4")}`,
                          pointRadius: 0,
                          data: timeseries_bloodstock.data.type_o,
                          backgroundColor: BLOOD_COLOR[400],
                          fill: true,
                          borderWidth: 0,
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
              </Tabs>
            </div>
          </div>
        </Section> */}

        {/* What are the latest blood donation trends in {{ area }}? */}
        <Section
          title={t("blood.combine_header", { state: CountryAndStates[currentState] })}
          description={t("blood.combine_description")}
          date={timeseries_all.data_as_of}
        >
          <div className="w-full space-y-4">
            <Timeseries
              className=" h-[350px] w-full pt-6"
              title={t("blood.combine_title")}
              state={currentState}
              //menu={<MenuDropdown />}
              stats={null}
              data={{
                labels: filtered_timeline().x,
                datasets: [
                  {
                    type: "line",
                    label: `${t("blood.combine_tooltip1")}`,
                    pointRadius: 0,
                    data: filtered_timeline().line_daily,
                    borderColor: BLOOD_COLOR[500],
                    borderWidth: 1.5,
                  },
                  {
                    type: "bar",
                    label: `${t("blood.combine_tooltip2")}`,
                    data: filtered_timeline().daily,
                    backgroundColor: GRAYBAR_COLOR[100],
                  },
                ],
              }}
              enableGridX={false}
            />
            <Slider
              className="pt-7"
              type="range"
              value={data.minmax}
              data={timeseries_all.data.x}
              onChange={item => setData("minmax", item)}
            />
            <span className="text-sm text-dim">{t("common.slider")}</span>
          </div>
        </Section>
        {/* Choropleth view of organ donar in Malaysia */}
        <Section
          title={t("blood.choro_header")}
          description={t("blood.choro_description")}
          date={choropleth_malaysia_blood_donation.data_as_of}
          className={isMobile ? "border-b pt-12" : "border-b py-12"}
        >
          <div>
            <Choropleth
              className={isMobile ? "h-[400px] w-auto" : "h-[500px] w-full"}
              enableScale={false}
              // colorScale="CHOROPLETH_BLUE_SCALE"
              colorScale="blues"
              borderColor="#000"
              borderWidth={0.5}
              data={choropleth_malaysia_blood_donation.data.map((item: any) => ({
                id: CountryAndStates[item.state],
                state: CountryAndStates[item.state],
                value: item.data.perc === null ? -1 : item.data.perc,
              }))}
              unitY="%"
              graphChoice="state"
            />
          </div>
        </Section>
        {/* A breakdown of donations by key variables */}
        <Section
          title={t("blood.barmeter_header")}
          description={t("blood.barmeter_description")}
          date={barchart_variables.data_as_of}
        >
          <Tabs className="pb-4">
            {KEY_VARIABLES_SCHEMA.map(({ name, data }) => {
              return (
                <Panel key={name} name={name}>
                  <div className="grid w-full grid-cols-1 gap-12 lg:grid-cols-3">
                    <BarMeter
                      title={
                        <Tooltip tip={t("blood.barmeter1_title_tooltip")}>
                          {open => (
                            <span
                              className="text-base font-bold underline decoration-dashed underline-offset-4"
                              onClick={() => open()}
                            >
                              {t("blood.barmeter1_title")}
                            </span>
                          )}
                        </Tooltip>
                      }
                      className="flex-col"
                      state={currentState}
                      data={data.blood_group}
                      layout="horizontal"
                      unit="%"
                      sort="desc"
                    />
                    <BarMeter
                      title={t("blood.barmeter2_title")}
                      className="flex-col"
                      state={currentState}
                      data={data.donation_type}
                      layout="horizontal"
                      unit="%"
                      sort="desc"
                    />
                    <BarMeter
                      title={t("blood.barmeter3_title")}
                      className="flex-col"
                      state={currentState}
                      data={data.location}
                      layout="horizontal"
                      unit="%"
                      sort="desc"
                    />
                    <BarMeter
                      title={t("blood.barmeter4_title")}
                      className="flex-col"
                      state={currentState}
                      data={data.donation_regularity}
                      layout="horizontal"
                      unit="%"
                      sort="desc"
                    />
                    <BarMeter
                      title={t("blood.barmeter5_title")}
                      className="flex-col"
                      state={currentState}
                      data={data.social_group}
                      layout="horizontal"
                      unit="%"
                      sort="desc"
                    />
                  </div>
                </Panel>
              );
            })}
          </Tabs>
        </Section>

        {/* How strong is the new donor recruitment in {{ area }}? */}
        <Section
          title={t("blood.bar1_header", { state: CountryAndStates[currentState] })}
          description={t("blood.bar1_description")}
          date={barchart_time.data_as_of}
        >
          <div className="grid w-full grid-cols-1 gap-12 xl:grid-cols-2">
            <div>
              <Tabs title={t("blood.bar1_title")} state={currentState}>
                {/* //menu={<MenuDropdown />}  */}
                <Panel name={t("blood.annual")}>
                  <Bar
                    className="h-[250px]"
                    data={{
                      labels: barchart_time.data.annual.x,
                      datasets: [
                        {
                          label: `${t("blood.bar1_tooltip1")}`,
                          data: barchart_time.data.annual.y,
                          backgroundColor: GRAYBAR_COLOR[200],
                          borderWidth: 0,
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
                <Panel name={t("blood.monthly")}>
                  <Bar
                    className="h-[250px]"
                    data={{
                      labels: barchart_time.data.monthly.x,
                      datasets: [
                        {
                          label: `${t("blood.bar1_tooltip1")}`,
                          data: barchart_time.data.monthly.y,
                          backgroundColor: GRAYBAR_COLOR[100],
                          borderWidth: 0,
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
              </Tabs>
            </div>
            <div>
              <Tabs title={t("blood.bar2_title")} state={currentState}>
                {/* //menu={<MenuDropdown />} */}
                <Panel name={t("blood.year")}>
                  <Bar
                    className="h-[250px]"
                    data={{
                      labels: barchart_age.data.past_year.x,
                      datasets: [
                        {
                          label: `${t("blood.bar2_tooltip1")}`,
                          data: barchart_age.data.past_year.y,
                          backgroundColor: GRAYBAR_COLOR[200],
                          borderWidth: 0,
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
                <Panel name={t("blood.month")}>
                  <Bar
                    className="h-[250px]"
                    data={{
                      labels: barchart_age.data.past_month.x,
                      datasets: [
                        {
                          label: `${t("blood.bar2_tooltip1")}`,
                          data: barchart_age.data.past_month.y,
                          backgroundColor: GRAYBAR_COLOR[100],
                          borderWidth: 0,
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
              </Tabs>
            </div>
          </div>
        </Section>

        {/* What proportion of the population in {{ area }} donates blood?  */}
        {/* <Section
          title={t("blood.heatmap_header", { state: CountryAndStates[currentState] })}
          description={t("blood.heatmap_description")}
          date={heatmap_donorrate.data_as_of}
        >
          <div className="grid grid-cols-1 gap-12 xl:grid-cols-2">
            <div className="w-full overflow-visible">
              <Tabs
                title={t("blood.heatmap1_title")}
                //menu={<MenuDropdown />}
                state={currentState}
              >
                <Panel name={t("blood.heatmap1_panel1")}>
                  <>
                    <Heatmap
                      className="flex h-[150px] overflow-visible"
                      data={[
                        heatmap_donorrate.data.capita.male,
                        heatmap_donorrate.data.capita.female,
                      ]}
                      subdata
                      axisLeft="default"
                      color="blues"
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
                      title={t("blood.heatmap2_title")}
                      data={[
                        heatmap_donorrate.data.capita.male_chinese,
                        heatmap_donorrate.data.capita.male_indian,
                        heatmap_donorrate.data.capita.male_bumi,
                        heatmap_donorrate.data.capita.male_other,
                      ]}
                      subdata
                      axisLeft="default"
                      axisTop={null}
                      color="blues"
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
                      title={t("blood.heatmap3_title")}
                      data={[
                        heatmap_donorrate.data.capita.female_chinese,
                        heatmap_donorrate.data.capita.female_indian,
                        heatmap_donorrate.data.capita.female_bumi,
                        heatmap_donorrate.data.capita.female_other,
                      ]}
                      subdata
                      axisLeft="default"
                      axisTop={null}
                      color="blues"
                    />
                  </>
                </Panel>

                <Panel name={t("blood.heatmap1_panel2")}>
                  <>
                    <Heatmap
                      className="flex h-[150px] overflow-auto lg:overflow-visible"
                      data={[heatmap_donorrate.data.perc.male, heatmap_donorrate.data.perc.female]}
                      subdata
                      axisLeft="default"
                      unitY="%"
                      color="blues"
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
                      title={t("blood.heatmap2_title")}
                      data={[
                        heatmap_donorrate.data.perc.male_chinese,
                        heatmap_donorrate.data.perc.male_indian,
                        heatmap_donorrate.data.perc.male_bumi,
                        heatmap_donorrate.data.perc.male_other,
                      ]}
                      subdata
                      unitY="%"
                      axisLeft="default"
                      axisTop={null}
                      color="blues"
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
                      title={t("blood.heatmap3_title")}
                      data={[
                        heatmap_donorrate.data.perc.female_chinese,
                        heatmap_donorrate.data.perc.female_indian,
                        heatmap_donorrate.data.perc.female_bumi,
                        heatmap_donorrate.data.perc.female_other,
                      ]}
                      subdata
                      unitY="%"
                      axisLeft="default"
                      axisTop={null}
                      color="blues"
                    />
                  </>
                </Panel>
                <Panel name={t("blood.heatmap1_panel3")}>
                  <>
                    <Heatmap
                      className="flex h-[150px] overflow-visible"
                      data={[heatmap_donorrate.data.abs.male, heatmap_donorrate.data.abs.female]}
                      subdata
                      axisLeft="default"
                      valueFormat="<-,.1~s"
                      color="blues"
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
                      title={t("blood.heatmap2_title")}
                      data={[
                        heatmap_donorrate.data.abs.male_chinese,
                        heatmap_donorrate.data.abs.male_indian,
                        heatmap_donorrate.data.abs.male_bumi,
                        heatmap_donorrate.data.abs.male_other,
                      ]}
                      subdata
                      valueFormat="<-,.2~s"
                      axisLeft="default"
                      axisTop={null}
                      color="blues"
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
                      title={t("blood.heatmap3_title")}
                      data={[
                        heatmap_donorrate.data.abs.female_chinese,
                        heatmap_donorrate.data.abs.female_indian,
                        heatmap_donorrate.data.abs.female_bumi,
                        heatmap_donorrate.data.abs.female_other,
                      ]}
                      subdata
                      valueFormat="<-,.1~s"
                      axisLeft="default"
                      axisTop={null}
                      color="blues"
                    />
                  </>
                </Panel>
              </Tabs>
            </div>

            <Heatmap
              className="flex h-[550px] w-[600px] overflow-auto lg:overflow-visible "
              title={t("blood.heatmap4_title")}
              state={currentState}
              //menu={<MenuDropdown />}
              data={heatmap_retention.data}
              unitY="%"
              unitX={t("common.yr")}
              axisLeft={{
                ticksPosition: "before",
                tickSize: 0,
                tickPadding: 10,
                tickRotation: 0,
              }}
              legend={{
                top: `${t("blood.heatmap4_x")}`,
                left: `${t("blood.heatmap4_y")}`,
              }}
              color="blues"
              colorMax={35}
            />
          </div>
        </Section> */}

        {/* How is this data collected? */}
        <Section
          title={t("blood.map_header")}
          description={t("blood.map_description")}
          date={map_facility.data_as_of}
        >
          <div className="grid grid-cols-1 gap-12 xl:grid-cols-2">
            <div className="w-full space-y-3">
              <div className="flex flex-wrap justify-between">
                <div className="flex items-center gap-4">
                  <MapPinIcon className="h-5 w-auto text-dim" />
                  <h4>{t("common.zoom")}</h4>
                </div>
                <Button
                  onClick={handleClearSelection}
                  disabled={!data.zoom_state}
                  icon={<ArrowPathIcon className="h-4 w-4" />}
                >
                  {t("common.clear_selection")}
                </Button>
              </div>
              <StateDropdown
                currentState={data.zoom_state}
                onChange={selected => {
                  setData("zoom_facility", undefined);
                  setData("zoom_state", selected.value);
                }}
                exclude={["kvy", "lbn", "pls", "pjy", "mys"]}
                width="w-full"
              />
              <Dropdown
                placeholder={t("placeholder.facility")}
                onChange={item => setData("zoom_facility", item)}
                selected={data.zoom_facility}
                disabled={!data.zoom_state}
                options={
                  data.zoom_state !== undefined
                    ? Object.keys(map_facility.data[data.zoom_state]).map((facility, index) => {
                        return {
                          label: facility,
                          value: index,
                        };
                      })
                    : []
                }
                width="w-full"
              />
              {timeseries_facility.data?.[data.zoom_state]?.[data.zoom_facility?.label] ? (
                <div className="w-full pt-7">
                  <Timeseries
                    className="h-[300px] w-full pt-4"
                    title={t("blood.bar3_title")}
                    state={
                      <p className="pt-4 text-sm text-dim">
                        {t("common.data_for", {
                          state: `${data.zoom_facility?.label}, ${
                            CountryAndStates[data.zoom_state]
                          }`,
                        })}
                      </p>
                    }
                    //menu={<MenuDropdown />}
                    data={{
                      labels:
                        timeseries_facility.data[data.zoom_state!][data.zoom_facility.label].x,
                      datasets: [
                        {
                          type: "line",
                          label: `${t("blood.bar3_tooltips1")}`,
                          data: timeseries_facility.data[data.zoom_state!][data.zoom_facility.label]
                            .line,
                          borderColor: BLOOD_COLOR[400],
                          borderWidth: 1.5,
                        },
                        {
                          type: "bar",
                          label: `${t("blood.bar3_tooltips2")}`,
                          data: timeseries_facility.data[data.zoom_state!][data.zoom_facility.label]
                            .daily,
                          backgroundColor: GRAYBAR_COLOR[100],
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </div>
              ) : (
                <Empty
                  title={t("blood.bar3_title")}
                  type="timeseries"
                  className="h-[300px] w-full pt-7"
                  placeholder={t("placeholder.facility")}
                />
              )}
            </div>

            {data.zoom_facility && data.zoom_state ? (
              <OSMapWrapper
                className="h-[460px] w-full rounded-xl"
                title={
                  data.zoom_state && data.zoom_facility
                    ? `${data.zoom_facility.label}, ${CountryAndStates[data.zoom_state]}`
                    : t("blood.map_title")
                }
                zoom={data.zoom_facility ? 8 : 5}
                position={
                  data.zoom_facility && data.zoom_state
                    ? [
                        map_facility.data[data.zoom_state][data.zoom_facility.label].lat,
                        map_facility.data[data.zoom_state][data.zoom_facility.label].lon,
                      ]
                    : undefined
                }
                markers={
                  data.zoom_facility && data.zoom_state
                    ? [
                        {
                          name: `${data.zoom_facility.label}, ${CountryAndStates[data.zoom_state]}`,
                          position: [
                            map_facility.data[data.zoom_state][data.zoom_facility.label].lat,
                            map_facility.data[data.zoom_state][data.zoom_facility.label].lon,
                          ],
                        },
                      ]
                    : []
                }
              />
            ) : isMobile ? (
              <img
                src="/static/images/osm_placeholder_mobile.png"
                className="h-[460px] w-full rounded-xl"
              />
            ) : (
              <img
                src="/static/images/osm_placeholder.png"
                className="h-[460px] w-full rounded-xl"
              />
            )}
          </div>
        </Section>
      </Container>
    </>
  );
};

export default BloodDonationDashboard;

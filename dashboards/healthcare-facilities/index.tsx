/**
 * Please do not remove the commented code.
 */
import {
  Hero,
  Container,
  Bar,
  Search,
  Section,
  StateDropdown,
  Dropdown,
  Table,
  Button,
  Empty,
} from "@components/index";
import { ArrowPathIcon, MapPinIcon } from "@heroicons/react/24/solid";
import { useData } from "@hooks/useData";
import { CountryAndStates, BREAKPOINTS } from "@lib/constants";
import { FACILTIES_TABLE_SCHEMA } from "@lib/schema/healthcare-facilities";
import dynamic from "next/dynamic";
import { FunctionComponent, useEffect } from "react";
import { OptionType } from "@components/types";
import { useTranslation } from "next-i18next";
import { get } from "@lib/api";
import { useWindowWidth } from "@hooks/useWindowWidth";
import { DateTime } from "luxon";
import { useRouter } from "next/router";

const OSMapWrapper = dynamic(() => import("@components/OSMapWrapper"), { ssr: false });

interface HealthcareFacilitiesDashboardProps {
  last_updated: number;
  facility_table: any;
  state_district_mapping: any;
  facility_types: any;
}

const HealthcareFacilitiesDashboard: FunctionComponent<HealthcareFacilitiesDashboardProps> = ({
  last_updated,
  facility_table,
  state_district_mapping,
  facility_types,
}) => {
  const { data, setData } = useData({
    zoom_facility_type: undefined,
    zoom_state: undefined,
    zoom_district: undefined,
    table_state: undefined,
    table_district: undefined,
    table_facility_type: undefined,
    map_markers: [],
    map_timestamp: undefined,
    // bar_distances_within: undefined,
    // bar_distances_between: undefined,
  });
  const { t } = useTranslation("common");
  const router = useRouter();
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < BREAKPOINTS.MD;

  const handleClearSelection = () => {
    setData("zoom_state", undefined);
    setData("zoom_facility_type", undefined);
    setData("zoom_district", undefined);
    setData("map_markers", []);
    setData("map_timestamp", undefined);
    // setData("bar_distances_within", undefined);
    // setData("bar_distances_between", undefined);
  };

  const fetchProximities = async () => {
    if (!data.zoom_state || !data.zoom_facility_type || !data.zoom_district) {
      setData("map_markers", []);
      setData("map_timestamp", undefined);
      //   setData("bar_distances_within", []);
      //   setData("bar_distances_district", []);
      return;
    }
    const { data: result } = await get("/kkmnow", {
      dashboard: "facilities",
      table: "false",
      state: data.zoom_state,
      fac_type: data.zoom_facility_type.value.toLowerCase(),
      district: data.zoom_district.label.toLowerCase().replaceAll(" ", "-"),
    });

    setData("map_markers", Array.isArray(result.locations.data) ? result.locations.data : []);
    setData("map_timestamp", result.locations.data_as_of);
    // setData("bar_distances_within", result.distances_within);
    // setData("bar_distances_between", result.distances_between);
  };

  useEffect(() => {
    fetchProximities().catch(e => console.error(e));
  }, [data.zoom_district, data.zoom_facility_type, data.zoom_state]);

  return (
    <>
      <Hero background="facilities-banner">
        <div className="space-y-4 xl:w-2/3">
          <span className="text-sm font-bold uppercase tracking-widest text-dim">
            {t("healthcare.title")}
          </span>
          <h3 className="text-black">{t("healthcare.title_header")}</h3>
          <p className="text-dim">{t("healthcare.title_description")}</p>

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
        <Section title={t("healthcare.table_header")} date={facility_table.data_as_of}>
          <div className="mt-2">
            <Table
              data={facility_table.data}
              className="table-facility table-stripe"
              config={FACILTIES_TABLE_SCHEMA()}
              controls={setColumnFilters => (
                <>
                  <StateDropdown
                    label={t("common.state")}
                    currentState={data.table_state}
                    onChange={selected => {
                      setData("table_state", selected.value);
                      setColumnFilters([{ id: "state", value: selected.value }]);
                    }}
                    exclude={["kvy", "mys"]}
                    width="w-full lg:w-64"
                  />
                  <Dropdown
                    label={t("common.district")}
                    selected={data.table_district}
                    placeholder={
                      !data.table_state ? t("placeholder.state_first") : t("placeholder.district")
                    }
                    options={
                      data.table_state
                        ? state_district_mapping[data.table_state].map((district: string) => {
                            return { label: district, value: district };
                          })
                        : []
                    }
                    onChange={selected => {
                      setData("table_district", selected);
                      setColumnFilters(state =>
                        state.concat({ id: "district", value: selected.value })
                      );
                    }}
                    width="w-full lg:w-64"
                  />
                  <Dropdown
                    selected={data.table_facility_type}
                    placeholder={t("placeholder.all")}
                    label={t("common.type")}
                    options={facility_types.map((item: string): OptionType => {
                      return {
                        label: t("healthcare.".concat(item)),
                        value: item.toLowerCase(),
                      };
                    })}
                    onChange={selected => {
                      setData("table_facility_type", selected);
                      setColumnFilters(state =>
                        state.concat({ id: "type", value: selected.label })
                      );
                    }}
                    width="w-full"
                  />
                  {(data.table_state || data.table_district || data.table_facility_type) && (
                    <Button
                      className="justify-end text-right text-sm text-dim"
                      onClick={() => {
                        setData("table_state", undefined);
                        setData("table_district", undefined);
                        setData("table_facility_type", undefined);
                        setColumnFilters([]);
                      }}
                      icon={<ArrowPathIcon className="h-4 w-4" />}
                    >
                      {t("common.clear_selection")}
                    </Button>
                  )}
                </>
              )}
              search={setGlobalFilter => (
                <Search
                  className="w-full lg:w-auto"
                  onChange={query => setGlobalFilter(query ?? "")}
                />
              )}
              enablePagination
              cellClass="text-left"
            />
          </div>
        </Section>
        <div className="grid grid-cols-1 gap-8 py-12 lg:grid-cols-3">
          <Section
            className="col-span-1"
            title={t("healthcare.map_header")}
            description={t("healthcare.map_description1")}
            date={null}
          >
            <div className="w-full space-y-2 lg:space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h4 className="flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5 text-dim" />
                  {t("healthcare.zoom")}
                </h4>

                {data.zoom_facility_type && (
                  <Button
                    onClick={handleClearSelection}
                    icon={<ArrowPathIcon className="h-4 w-4" />}
                  >
                    {t("common.clear_selection")}
                  </Button>
                )}
              </div>

              <Dropdown
                placeholder={t("placeholder.facility_type")}
                onChange={item => setData("zoom_facility_type", item)}
                selected={data.zoom_facility_type}
                options={facility_types.map((fac: any) => {
                  return { label: t("healthcare.".concat(fac)), value: fac } as OptionType<
                    string,
                    string
                  >;
                })}
                width="w-full"
              />

              <StateDropdown
                currentState={data.zoom_state}
                onChange={selected => {
                  setData("zoom_state", selected.value);
                  setData("zoom_district", undefined);
                }}
                disabled={!data.zoom_facility_type}
                exclude={["kvy", "mys"]}
                width="w-full"
              />
              <Dropdown
                placeholder={t("placeholder.district")}
                onChange={item => setData("zoom_district", item)}
                selected={data.zoom_district}
                disabled={!data.zoom_state}
                options={
                  data.zoom_state
                    ? state_district_mapping[data.zoom_state].map((district: any) => {
                        return { label: district, value: district } as OptionType<string, string>;
                      })
                    : []
                }
                width="w-full"
              />
            </div>
          </Section>
          <div className="col-span-1 lg:col-span-2">
            {data.zoom_facility_type && data.zoom_state && data.zoom_district ? (
              <OSMapWrapper
                title={`${
                  data.zoom_facility_type
                    ? data.zoom_facility_type.label.concat(t("common.in"))
                    : t("healthcare.map_title")
                } ${data.zoom_district ? data.zoom_district.label + ", " : ""} ${
                  CountryAndStates[data.zoom_state ?? "mys"]
                }`}
                date={t("common.data_of", {
                  date: DateTime.fromSQL(data.map_timestamp)
                    .setLocale(router.locale ?? router.defaultLocale!)
                    .toFormat("dd MMM yyyy, HH:mm"),
                })}
                position={
                  data.map_markers.length
                    ? [data.map_markers[0].lat, data.map_markers[0].lon]
                    : undefined
                }
                zoom={data.map_markers.length ? 9 : undefined}
                markers={data.map_markers.map((marker: any) => ({
                  name: marker.name,
                  position: [marker.lat, marker.lon],
                }))}
                className="h-[520px] w-full rounded-xl"
              />
            ) : isMobile ? (
              <img
                src="/static/images/osm_placeholder_mobile.png"
                className="h-[460px] w-full rounded-xl"
              />
            ) : (
              <img
                src="/static/images/osm_placeholder_long.png"
                className="h-[460px] w-full rounded-xl"
              />
            )}
          </div>
        </div>

        {/* 
        // Dataset not ready
        <div className="grid w-full grid-cols-1 gap-12 py-12 xl:grid-cols-2">
          {data.bar_distances_within && data.bar_distances_between ? (
            <>
              <Bar
                title={
                  <div className="flex self-center text-base font-bold">
                    Distance to Nearest{" "}
                    {data.zoom_facility_type ? data.zoom_facility_type.label : ""} within{" "}
                    {data.zoom_district ? data.zoom_district.label + ", " : ""}{" "}
                    {CountryAndStates[data.zoom_state]}
                  </div>
                }
                className="h-[300px]"
                data={{
                  labels: data.bar_distances_within.x,
                  datasets: [
                    {
                      label: `No. of ${data.zoom_facility_type.label}`,
                      data: data.bar_distances_within.y,
                      backgroundColor: GRAYBAR_COLOR[200],
                    },
                  ],
                }}
                enableGridX={false}
              />
              <Bar
                title={
                  <div className="flex self-center text-base font-bold">
                    Distance of {data.zoom_facility_type.label} in{" "}
                    {data.zoom_district ? data.zoom_district.label + ", " : ""}{" "}
                    {CountryAndStates[data.zoom_state]} relative to other{" "}
                    {data.zoom_district === "" ? "States" : "Districts"}
                  </div>
                }
                data={{
                  labels: data.bar_distances_between.x,
                  datasets: [
                    {
                      label: `Distance to ${data.zoom_facility_type.label} (km)`,
                      data: data.bar_distances_between.y,
                      backgroundColor: GRAYBAR_COLOR[200],
                    },
                  ],
                }}
                className="h-[380px]"
                unitY="km"
                enableGridX={false}
              />
            </>
          ) : (
            <>
              <Empty
                title="Distance to Nearest Facility"
                type="timeseries"
                className="h-[300px] w-full"
                placeholder="Please select a district"
              />
              <Empty
                title="Relative to Nearest Facility"
                type="timeseries"
                className="h-[300px] w-full"
                placeholder="Please select a district"
              />
            </>
          )}
        </div> */}
      </Container>
    </>
  );
};

export default HealthcareFacilitiesDashboard;

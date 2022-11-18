import { ArrowPathIcon } from "@heroicons/react/20/solid";
import { CountryAndStates } from "@lib/constants";

import {
  Container,
  Button,
  Hero,
  StateDropdown,
  Search,
  Section,
  Tabs,
  Panel,
} from "@components/index";
import { FunctionComponent } from "react";
import dynamic from "next/dynamic";
import { useData } from "@hooks/useData";
import { HOSPITAL_TABLE_SCHEMA } from "@lib/schema/hospital-bed-utilisation";
import { useTranslation } from "next-i18next";
import { DateTime } from "luxon";
import { useRouter } from "next/router";

const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });
const Table = dynamic(() => import("@components/Chart/Table"), { ssr: false });
const Empty = dynamic(() => import("@components/Chart/Empty"), { ssr: false });
const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

interface HospitalBedUtilisationDashboardProps {
  last_updated: number;
  choropleth_bed: any;
  table_facility: any;
  timeseries_facility: any;
  timeseries_state: any;
}

const HospitalBedUtilisationDashboard: FunctionComponent<HospitalBedUtilisationDashboardProps> = ({
  last_updated,
  choropleth_bed,
  table_facility,
  timeseries_facility,
}) => {
  const { data, setData } = useData({
    state: undefined,
    facility: undefined,
  });
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <>
      <Hero background="hospbed-banner">
        <div className="space-y-4 xl:w-2/3">
          <span className="text-sm font-bold uppercase tracking-widest text-dim">
            {t("bed.title")}
          </span>
          <h3 className="text-black">{t("bed.title_header")}</h3>
          <p className="text-dim">{t("bed.title_description")}</p>

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
          title={t("bed.choro_header", { state: CountryAndStates["mys"] })}
          description={t("bed.choro_description")}
          date={choropleth_bed.data_as_of}
        >
          <Tabs className="flex flex-wrap justify-end gap-2">
            <Panel key={0} name={t("bed.tab_choro1")}>
              <Choropleth
                className={"h-[400px] w-auto lg:h-[500px] lg:w-full"}
                colorScale="OrRd"
                enableScale={false}
                data={choropleth_bed.data.map((item: any) => ({
                  id: CountryAndStates[item.state],
                  value: item.data.util_nonicu,
                }))}
                graphChoice="state"
                unitY="%"
              />
            </Panel>
            <Panel key={1} name={t("bed.tab_choro2")}>
              <Choropleth
                className={"h-[400px] w-auto lg:h-[500px] lg:w-full"}
                colorScale="reds"
                enableScale={false}
                data={choropleth_bed.data.map((item: any) => ({
                  id: CountryAndStates[item.state],
                  value: item.data.util_icu,
                }))}
                graphChoice="state"
                unitY="%"
              />
            </Panel>
          </Tabs>
        </Section>
        <Section title={t("bed.table_header")} date={table_facility.data_as_of}>
          <Table
            className="table-bed table-stripe"
            controls={setColumnFilters => (
              <>
                <StateDropdown
                  sublabel={t("common.state")}
                  currentState={data.table_state}
                  onChange={selected => {
                    setData("table_state", selected.value);
                    setColumnFilters([{ id: "state", value: selected.value }]);
                  }}
                  exclude={["kvy", "mys"]}
                  width="w-full lg:w-64"
                />
                <Button
                  onClick={() => {
                    setData("table_state", undefined);
                    setData("table_district", undefined);
                    setData("table_facility_type", undefined);
                    setColumnFilters([]);
                  }}
                  className="justify-end text-right text-sm text-dim"
                  disabled={!data.table_state && !data.table_district && !data.table_facility_type}
                  icon={<ArrowPathIcon className="h-4 w-4" />}
                >
                  {t("common.clear_selection")}
                </Button>
              </>
            )}
            search={setGlobalFilter => (
              <Search
                className="w-full lg:w-auto"
                onChange={query => setGlobalFilter(query ?? "")}
              />
            )}
            data={table_facility.data}
            config={HOSPITAL_TABLE_SCHEMA(({ state, facility }) => {
              setData("state", state);
              setData("facility", facility);
            })}
            enablePagination
          />
        </Section>
        <Section
          title={t("bed.timeseries_header", { facility: data.facility ?? "Malaysia" })}
          date={timeseries_facility.data_as_of}
        >
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {data.state && data.facility ? (
              <>
                <Timeseries
                  className="h-[250px] w-full"
                  title={t("bed.timeseries_beds")}
                  enableGridX={false}
                  unitY="%"
                  data={{
                    labels: timeseries_facility.data[data.state][data.facility].x,
                    datasets: [
                      {
                        type: "line",
                        label: t("bed.timeseries_utilrate"),
                        data: timeseries_facility.data[data.state][data.facility].line_util_non_icu,
                        borderColor: "#DC2626",
                        borderWidth: 1.5,
                      },
                    ],
                  }}
                />
                <Timeseries
                  className="h-[250px] w-full"
                  title={t("bed.timeseries_icu")}
                  description={
                    timeseries_facility.data[data.state][data.facility].line_util_icu.every(
                      (item: number | null) => item === null
                    )
                      ? t("bed.timeseries_notavailable")
                      : ""
                  }
                  data={{
                    labels: timeseries_facility.data[data.state][data.facility].x,
                    datasets: [
                      {
                        type: "line",
                        label: t("bed.timeseries_utilrate"),
                        data: timeseries_facility.data[data.state][data.facility].line_util_icu,
                        borderColor: "#DC2626",
                        borderWidth: 1.5,
                      },
                    ],
                  }}
                  unitY="%"
                  enableGridX={false}
                />
              </>
            ) : (
              <>
                <Empty
                  title={t("bed.timeseries_beds")}
                  type="timeseries"
                  className="h-[250px] w-full"
                  placeholder={t("bed.timeseries_placeholder")}
                />
                <Empty
                  title={t("bed.timeseries_icu")}
                  type="timeseries"
                  className="h-[250px] w-full"
                  placeholder={t("bed.timeseries_placeholder")}
                />
              </>
            )}
          </div>
        </Section>
      </Container>
    </>
  );
};

export default HospitalBedUtilisationDashboard;

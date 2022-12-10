import type { GeoJsonObject } from "geojson";
import type { OptionType } from "@components/types";
import Container from "@components/Container";
import Hero from "@components/Hero";
import Section from "@components/Section";
import StateDropdown from "@components/Dropdown/StateDropdown";
import { useTranslation } from "next-i18next";
import { FunctionComponent } from "react";
import MalaysiaGeojson from "@lib/geojson/malaysia.json";
import Dropdown from "@components/Dropdown";
import Button from "@components/Button";
import { XMarkIcon } from "@heroicons/react/24/outline";
import BarMeter from "@components/Chart/BarMeter";
import dynamic from "next/dynamic";
import JitterplotOverlay from "@components/Chart/Jitterplot/overlay";
import { useData } from "@hooks/useData";
import { CountryAndStates } from "@lib/constants";
import { useRouter } from "next/router";

const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });
const Jitterplot = dynamic(() => import("@components/Chart/Jitterplot"), { ssr: false });
const Pyramid = dynamic(() => import("@components/Chart/Pyramid"), { ssr: false });
const OSMapWrapper = dynamic(() => import("@components/OSMapWrapper"), { ssr: false });

interface KawasankuDashboardProps {}

const KawasankuDashboard: FunctionComponent<KawasankuDashboardProps> = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const state = (router.query.state as string) ?? "mys";

  const { data, setData } = useData({
    comparator: [],
  });

  const handleComparator = (e: OptionType) => {
    if (data.comparator.length >= 3) return;
    if (data.comparator.includes(e.label)) return;

    setData("comparator", data.comparator.concat(e.label));
  };

  return (
    <>
      <Hero background="relative to-transparent bg-gradient-to-b lg:bg-gradient-to-r from-[#EDF8ED] via-[#EDF8ED]">
        <div className="space-y-4 xl:w-2/3">
          <span className="text-sm font-bold uppercase tracking-widest text-dim">KAWASANKU</span>
          <h3 className="text-black">Learn about your area today!</h3>
          <p className="text-dim">{t("bed.title_description")}</p>

          {/* <p className="text-sm text-dim">
            {t("common.last_updated", {
              date: DateTime.fromMillis(last_updated)
                .setLocale(router.locale ?? router.defaultLocale!)
                .toFormat("dd MMM yyyy, HH:mm"),
            })}
          </p> */}

          <div className="flex w-full flex-col items-baseline justify-start gap-2 lg:flex-row">
            <p className="font-bold text-dim">Find my area:</p>
            <StateDropdown width="w-full lg:w-fit" />
            <Dropdown options={[]} onChange={() => {}} width="w-full lg:w-fit" />
            <Dropdown options={[]} onChange={() => {}} width="w-full lg:w-fit" />
            <Button icon={<XMarkIcon className="h-4 w-4" />}>Clear all</Button>
          </div>
        </div>
        <OSMapWrapper
          geojson={MalaysiaGeojson as GeoJsonObject}
          position={[5.1420589, 80]}
          className="absolute top-0 left-0 -z-10 w-full lg:h-full"
          enableZoom={false}
          zoom={5}
        />
      </Hero>

      <Container className="min-h-screen">
        <Section
          title={"What does the population of Malaysia look like?"}
          date={"Data as of MyCensus 2020"}
        >
          <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-5 lg:gap-12">
            <div className="col-span-1 w-full lg:col-span-2">
              <Pyramid
                title="Gender Distribution"
                className="h-[500px] w-full"
                minX={-10}
                maxX={10}
              />
            </div>
            <div className="col-span-1 grid grid-cols-1 gap-6 lg:col-span-3 lg:grid-cols-3 lg:gap-12">
              <BarMeter title="Sex" layout="horizontal" />
              <BarMeter title="Age Group" layout="horizontal" />
              <BarMeter title="Nationality" layout="horizontal" />
              <BarMeter title="Ethnicity" layout="horizontal" />
              <BarMeter title="Religion" layout="horizontal" />
              <BarMeter title="Marital Status" layout="horizontal" />
            </div>
          </div>
        </Section>
        <Section
          title={"A comparison of key variables across states"}
          date={"Data as of MyCensus 2020"}
        >
          <div className="flex w-full gap-2 lg:flex-row">
            <StateDropdown
              width="w-fit"
              sublabel="Spotlight:"
              disabled={data.comparator.length >= 3}
              onChange={handleComparator}
            />

            <p className="flex items-center gap-2 py-1 px-2 text-sm font-medium leading-6">
              {CountryAndStates[state]}
              <div className="h-2 w-2 rounded-full bg-black" />
            </p>

            {data.comparator.length > 0 && (
              <>
                {data.comparator.map((item: string, index: number) => {
                  const styles = ["bg-danger", "bg-primary", "bg-warning"];
                  return (
                    <Button
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
                  Clear all
                </Button>
              </>
            )}
          </div>
          <div className="relative space-y-10">
            <JitterplotOverlay />
            <Jitterplot
              title="Geography"
              active={CountryAndStates[state]}
              actives={data.comparator}
            />
            <Jitterplot
              title="Population"
              active={CountryAndStates[state]}
              actives={data.comparator}
            />
            <Jitterplot
              title="Economy"
              active={CountryAndStates[state]}
              actives={data.comparator}
            />
            <Jitterplot
              title="Public Services"
              active={CountryAndStates[state]}
              actives={data.comparator}
            />
          </div>
        </Section>
        <Section
          title={"A geographic visualisation of selected indicators"}
          date={"Data as of MyCensus 2020"}
        >
          <Choropleth />
        </Section>
      </Container>
    </>
  );
};

export default KawasankuDashboard;

import Container from "@components/Container";
import GoogleMapWrapper from "@components/GoogleMapWrapper";
import Hero from "@components/Hero";
import Section from "@components/Section";
import Map from "@components/Map";
import StateDropdown from "@components/Dropdown/StateDropdown";
import { useTranslation } from "next-i18next";
import { FunctionComponent } from "react";
import MalaysiaGeojson from "@lib/geojson/malaysia.json";
import Dropdown from "@components/Dropdown";
import Button from "@components/Button";
import { XMarkIcon } from "@heroicons/react/24/outline";
import BarMeter from "@components/Chart/BarMeter";
import dynamic from "next/dynamic";

const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });
const Pyramid = dynamic(() => import("@components/Chart/Pyramid"), { ssr: false });

interface KawasankuDashboardProps {}

const KawasankuDashboard: FunctionComponent<KawasankuDashboardProps> = () => {
  const { t } = useTranslation();
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
        <GoogleMapWrapper apiKey={process.env.NEXT_PUBLIC_GMAP_API_KEY}>
          <Map geojson={MalaysiaGeojson} />
        </GoogleMapWrapper>
      </Hero>

      <Container className="min-h-screen">
        <Section
          title={"What does the population of Malaysia look like?"}
          date={"Data as of MyCensus 2020"}
        >
          <div className="grid grid-cols-5 gap-12">
            <div className="col-span-2 h-full">
              <Pyramid title="Gender Distribution" className="h-[500px]" minX={-10} maxX={10} />
            </div>
            <div className="col-span-3 grid grid-cols-3 gap-12">
              <BarMeter title="Sex" layout="horizontal" className="flex-col" />
              <BarMeter title="Age Group" layout="horizontal" className="flex-col" />
              <BarMeter title="Nationality" layout="horizontal" className="flex-col" />
              <BarMeter title="Ethnicity" layout="horizontal" className="flex-col" />
              <BarMeter title="Religion" layout="horizontal" className="flex-col" />
              <BarMeter title="Marital Status" layout="horizontal" className="flex-col" />
            </div>
          </div>
        </Section>
        <Section
          title={"A comparison of key variables across states"}
          date={"Data as of MyCensus 2020"}
        >
          <div>jitterplots go here</div>
        </Section>
        <Section
          title={"A geographic visualisation of selected indicators"}
          date={"Data as of MyCensus 2020"}
        >
          <Choropleth enableZoom={false} />
        </Section>
      </Container>
    </>
  );
};

export default KawasankuDashboard;

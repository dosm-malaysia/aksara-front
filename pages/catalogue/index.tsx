import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Page } from "@lib/types";
import { Container, Dropdown, Hero, Input, Metadata, Section } from "@components/index";
import { useTranslation } from "next-i18next";
import { useData } from "@hooks/useData";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { OptionType } from "@components/types";

const CatalogueIndex: Page = ({}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, setData } = useData({
    period: undefined,
    geographic: [],
    begin: undefined,
    datapoint: undefined,
    source: [],
  });

  useEffect(() => {
    const params = Object.entries(data)
      .filter(
        ([_, value]) => value !== undefined && value !== null && (value as Array<any>).length !== 0
      )
      .map(([key, value]) =>
        Array.isArray(value)
          ? `${key}=${value.map((item: OptionType) => item.value).join(",")}`
          : `${key}=${(value as OptionType).value}`
      )
      .join("&");
    router.push(router.pathname.concat("?", params));
  }, [data]);
  return (
    <>
      <Metadata title={t("nav.catalogue")} description={""} keywords={""} />
      <div>
        <Hero background="covid-banner">
          <div className="space-y-4 xl:w-2/3">
            <h3 className="text-black">Data Catalogue</h3>
            <p className="text-dim">
              Your one-stop interface to browse Malaysia’s wealth of open data. This page documents
              not just the data used on AKSARA, but all open data from all Malaysian government
              agencies.
            </p>

            <p className="text-sm text-dim">1057 Datasets, and counting</p>
          </div>
        </Hero>

        <Container className="min-h-screen">
          <div className="sticky top-14 flex gap-2 border-b bg-white py-4">
            <Input type="search" placeholder="Search for dataset" />
            <div className="flex gap-2">
              <Dropdown
                options={[
                  {
                    label: "Daily",
                    value: "daily",
                  },
                  {
                    label: "Weekly",
                    value: "weekly",
                  },
                  {
                    label: "Monthly",
                    value: "monthly",
                  },
                  {
                    label: "Quarterly",
                    value: "quarterly",
                  },
                  {
                    label: "Annually",
                    value: "annually",
                  },
                  {
                    label: "No Fixed Cadence",
                    value: "unfixed",
                  },
                ]}
                placeholder="Period"
                selected={data.period}
                onChange={e => setData("period", e)}
              />
              <Dropdown
                multiple
                title="Geographic"
                options={[
                  {
                    label: "National",
                    value: "national",
                  },
                  {
                    label: "State",
                    value: "state",
                  },
                  {
                    label: "District",
                    value: "district",
                  },
                  {
                    label: "Mukim",
                    value: "mukim",
                  },
                  {
                    label: "Parliament",
                    value: "parliament",
                  },
                  {
                    label: "DUN",
                    value: "dun",
                  },
                ]}
                selected={data.geographic}
                onChange={e => setData("geographic", e)}
              />

              <Dropdown
                label="Begin"
                options={[
                  {
                    label: "2010",
                    value: "2010",
                  },
                  {
                    label: "2011",
                    value: "2011",
                  },
                  {
                    label: "2012",
                    value: "2012",
                  },
                  {
                    label: "2013",
                    value: "2013",
                  },
                  {
                    label: "2014",
                    value: "2014",
                  },
                  {
                    label: "2015",
                    value: "2015",
                  },
                ]}
                selected={data.begin}
                onChange={e => setData("begin", e)}
              />
              <Dropdown
                label="Datapoint"
                options={[
                  {
                    label: "2010",
                    value: "2010",
                  },
                  {
                    label: "2011",
                    value: "2011",
                  },
                  {
                    label: "2012",
                    value: "2012",
                  },
                  {
                    label: "2013",
                    value: "2013",
                  },
                  {
                    label: "2014",
                    value: "2014",
                  },
                  {
                    label: "2015",
                    value: "2015",
                  },
                ]}
                selected={data.datapoint}
                onChange={e => setData("datapoint", e)}
              />
              <Dropdown
                multiple
                title="Data Source"
                options={[
                  {
                    label: "National",
                    value: "national",
                  },
                  {
                    label: "State",
                    value: "state",
                  },
                  {
                    label: "District",
                    value: "district",
                  },
                  {
                    label: "Mukim",
                    value: "mukim",
                  },
                  {
                    label: "Parliament",
                    value: "parliament",
                  },
                  {
                    label: "DUN",
                    value: "dun",
                  },
                ]}
                selected={data.source}
                onChange={e => setData("source", e)}
              />
            </div>
          </div>
          <Section title={"Category"}></Section>
          <Section title={"Healthcare"}></Section>
          <Section title={"Education"}></Section>
        </Container>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);

  // const { data } = await  // your fetch function here

  return {
    props: {
      ...i18n,
    },
  };
};

export default CatalogueIndex;

import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Page } from "@lib/types";
import {
  At,
  Button,
  Checkbox,
  Container,
  Dropdown,
  Hero,
  Input,
  Metadata,
  Modal,
  Radio,
  Section,
} from "@components/index";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "next-i18next";
import { useData } from "@hooks/useData";
import { FunctionComponent, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { OptionType } from "@components/types";
import { useWatch } from "@hooks/useWatch";
import Label from "@components/Label";
import debounce from "lodash/debounce";
import { get } from "@lib/api";

const CatalogueIndex: Page = ({
  query,
  collection,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation();

  const dummy = (length: number) =>
    Array(length).fill({
      href: "#",
      name: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
    });

  return (
    <>
      <Metadata title={t("nav.catalogue")} description={""} keywords={""} />
      <div>
        <Hero background="covid-banner">
          <div className="space-y-4 xl:w-2/3">
            <h3 className="text-black">Data Catalogue</h3>
            <p className="text-dim">
              Your one-stop interface to browse Malaysia's wealth of open data. This page documents
              not just the data used on AKSARA, but all open data from all Malaysian government
              agencies.
            </p>

            <p className="text-sm text-dim">1057 Datasets, and counting</p>
          </div>
        </Hero>

        <Container className="min-h-screen">
          <CatalogueFilter query={query} />
          <Section title={"Category"}>
            <ul className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-3">
              {dummy(11).map((item, index) => (
                <li key={index}>
                  <At href={item.href} className="text-primary underline hover:no-underline">
                    {item.name}
                  </At>
                </li>
              ))}
            </ul>
          </Section>
          <Section title={"Healthcare"}>
            <ul className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-3">
              {collection.health.map((item: any, index: number) => (
                <li key={index}>
                  <At
                    href={`/catalogue/${item.id}`}
                    className="text-primary underline hover:no-underline"
                  >
                    {item.catalog_name}
                  </At>
                </li>
              ))}
            </ul>
          </Section>
          <Section title={"Education"}>
            <ul className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-3">
              {dummy(11).map((item, index) => (
                <li key={index}>
                  <At href={item.href} className="text-primary underline hover:no-underline">
                    {item.name}
                  </At>
                </li>
              ))}
            </ul>
          </Section>
        </Container>
      </div>
    </>
  );
};

interface CatalogueFilterProps {
  query: Record<string, any>;
}

const CatalogueFilter: FunctionComponent<CatalogueFilterProps> = ({ query }) => {
  const router = useRouter();
  const { data, setData } = useData({
    period: query.period ? DUMMY_PERIOD.find(item => item.value === query.period) : undefined,
    geographic: query.geographic
      ? DUMMY_GEO.filter(item => query.geographic.split(",").includes(item.value))
      : [],
    begin: query.begin ? DUMMY_YEAR.find(item => item.value === query.begin) : undefined,
    datapoint: query.datapoint
      ? DUMMY_YEAR.find(item => item.value === query.datapoint)
      : undefined,
    source: query.source
      ? DUMMY_GEO.filter(item => query.source.split(",").includes(item.value))
      : [],
    search: query.search ?? "",
  });

  const actives = useMemo(
    () =>
      Object.entries(data).filter(
        ([_, value]) =>
          value !== undefined &&
          value !== null &&
          (value as Array<any>).length !== 0 &&
          value !== ""
      ),
    [data]
  );

  const search = useCallback(
    debounce(() => {
      const query = actives
        .map(([key, value]) =>
          Array.isArray(value)
            ? `${key}=${value.map((item: OptionType) => item.value).join(",")}`
            : `${key}=${(value as OptionType).value ?? value}`
        )
        .join("&");
      const url = [router.pathname, ...[query ? `?${query}` : ""]].join("");
      router.push(url);
    }),
    []
  );

  useWatch(() => {
    search();
  }, [data]);

  return (
    <div className="sticky top-14 flex items-center justify-between gap-2 border-b bg-white py-4">
      <Input
        className="border-0 pl-10"
        type="search"
        placeholder="Search for dataset"
        autoFocus
        value={data.search}
        onChange={e => setData("search", e)}
        icon={<MagnifyingGlassIcon className="h-4 w-4 lg:h-5 lg:w-5" />}
      />

      {/* Mobile */}
      <div className="block lg:hidden">
        <Modal
          trigger={open => (
            <Button
              onClick={open}
              className="block self-center border border-outline px-3 py-1.5 shadow-sm "
            >
              <span>Filter</span>
              <span className="rounded-md bg-black px-1 py-0.5 text-xs text-white">
                {actives.length}
              </span>
            </Button>
          )}
          title={<Label label="Filters:" className="block text-sm font-medium text-black" />}
          fullScreen
        >
          {close => (
            <div className="flex-grow space-y-4 divide-y overflow-y-auto pb-28">
              <Radio
                label="Time Range"
                name="period"
                className="flex flex-wrap gap-y-4 gap-x-5 px-1 pt-2"
                options={DUMMY_PERIOD}
                value={data.period}
                onChange={e => setData("period", e)}
              />
              <Checkbox
                label="Geographic"
                className="flex flex-wrap gap-y-4 gap-x-5 px-1 pt-2"
                name="geographic"
                options={DUMMY_GEO}
                value={data.geographic}
                onChange={e => setData("geographic", e)}
              />

              <div className="grid grid-cols-2 gap-4">
                <Dropdown
                  width="w-full"
                  label="Dataset Begin"
                  sublabel="Begin:"
                  options={DUMMY_YEAR}
                  selected={data.begin}
                  onChange={e => setData("begin", e)}
                />
                <Dropdown
                  label="Recent Datapoint"
                  sublabel="Datapoint:"
                  width="w-full"
                  options={DUMMY_YEAR}
                  selected={data.datapoint}
                  onChange={e => setData("datapoint", e)}
                />
              </div>

              <div className="pt-2">
                <Input
                  label="Data Source"
                  type="search"
                  className="w-full appearance-none rounded-lg border border-outline bg-white pl-8 pr-2 text-sm outline-none focus:border-outline focus:outline-none focus:ring-0 md:text-base"
                  placeholder="Search for dataset"
                  value={data.search}
                  onChange={e => setData("search", e)}
                  icon={<MagnifyingGlassIcon className="h-4 w-4 lg:h-5 lg:w-5" />}
                />
                <Checkbox
                  className="space-y-4 px-1"
                  name="source"
                  options={DUMMY_GEO}
                  value={data.source}
                  onChange={e => setData("source", e)}
                />
              </div>
              <div className="fixed bottom-0 left-0 w-full space-y-2 bg-white py-3 px-2">
                <Button
                  className="w-full justify-center bg-black font-medium text-white"
                  onClick={close}
                >
                  Apply filter
                </Button>
                <Button
                  className="w-full justify-center bg-outline py-1.5"
                  icon={<XMarkIcon className="h-4 w-4" />}
                  onClick={close}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>

      {/* Desktop */}
      <div className="hidden gap-2 xl:flex">
        <Dropdown
          options={DUMMY_PERIOD}
          placeholder="Period"
          selected={data.period}
          onChange={e => setData("period", e)}
        />
        <Dropdown
          multiple
          title="Geographic"
          options={DUMMY_GEO}
          selected={data.geographic}
          onChange={e => setData("geographic", e)}
        />

        <Dropdown
          sublabel="Begin"
          options={DUMMY_YEAR}
          selected={data.begin}
          onChange={e => setData("begin", e)}
        />
        <Dropdown
          sublabel="Datapoint"
          options={DUMMY_YEAR}
          selected={data.datapoint}
          onChange={e => setData("datapoint", e)}
        />
        <Dropdown
          multiple
          title="Data Source"
          options={DUMMY_GEO}
          selected={data.source}
          onChange={e => setData("source", e)}
        />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale, query }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);

  const { data } = await get("/data-catalog/");
  console.log(data);

  return {
    props: {
      ...i18n,
      query: query ?? {},
      collection: {
        health: data["COVID-19"],
      },
    },
  };
};

export default CatalogueIndex;

/**
 * Dummy data
 */

const DUMMY_PERIOD = [
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
];

const DUMMY_GEO = [
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
];

const DUMMY_YEAR = [
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
];

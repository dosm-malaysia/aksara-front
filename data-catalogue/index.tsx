import {
  At,
  Button,
  Checkbox,
  Container,
  Dropdown,
  Hero,
  Input,
  Modal,
  Radio,
  Section,
} from "@components/index";
import { ArrowTrendingUpIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { FunctionComponent } from "react";
import Label from "@components/Label";
import { useFilter } from "@hooks/useFilter";
import { useTranslation } from "next-i18next";
import { OptionType } from "@components/types";

type Catalogue = {
  id: string;
  catalog_name: string;
};

interface CatalogueIndexProps {
  query: Record<string, string>;
  collection: Array<[string, Catalogue[]]>;
  total: number;
}

const CatalogueIndex: FunctionComponent<CatalogueIndexProps> = ({ query, collection, total }) => {
  return (
    <>
      <div>
        <Hero background="hero-light-3">
          <div className="space-y-4 xl:w-2/3">
            <h3 className="text-black">Data Catalogue</h3>
            <p className="text-dim">
              Your one-stop interface to browse Malaysia's wealth of open-data. This page documents
              not just the data used on AKSARA, but all open data from all Malaysian government
              agencies.
            </p>

            <p className="flex items-center gap-2 text-sm text-dim">
              <ArrowTrendingUpIcon className="h-4 w-4" />
              <span>{total} Datasets, and counting</span>
            </p>
          </div>
        </Hero>

        <Container className="min-h-screen">
          <CatalogueFilter query={query} />
          {collection.map(([title, datasets]) => (
            <Section title={title}>
              <ul className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-3">
                {datasets.map((item: Catalogue, index: number) => (
                  <li key={index}>
                    <At
                      href={`/data-catalogue/${item.id}`}
                      className="text-primary underline hover:no-underline"
                    >
                      {item.catalog_name}
                    </At>
                  </li>
                ))}
              </ul>
            </Section>
          ))}
        </Container>
      </div>
    </>
  );
};

interface CatalogueFilterProps {
  query: Record<string, any>;
}

const CatalogueFilter: FunctionComponent<CatalogueFilterProps> = ({ query }) => {
  const { t } = useTranslation();
  const filterPeriods: Array<OptionType> = [
    { label: t("catalogue.filters.daily"), value: "DAILY" },
    { label: t("catalogue.filters.weekly"), value: "WEEKLY" },
    { label: t("catalogue.filters.monthly"), value: "MONTHLY" },
    { label: t("catalogue.filters.yearly"), value: "YEARLY" },
  ];
  const filterGeographics: Array<OptionType> = [
    { label: t("catalogue.filters.state"), value: "STATE" },
    { label: t("catalogue.filters.dun"), value: "DUN" },
    { label: t("catalogue.filters.national"), value: "NATIONAL" },
  ];
  const filterSources: Array<OptionType> = [
    { label: "KKM", value: "KKM" },
    { label: "DOSM", value: "DOSM" },
  ];

  const filterYears = (start: number, end: number): Array<OptionType> =>
    Array(end - start + 1)
      .fill(start)
      .map((year, index) => ({ label: `${year + index}`, value: `${year + index}` }));

  const { filter, setFilter, actives } = useFilter({
    period: query.period ? filterPeriods.find(item => item.value === query.period) : undefined,
    geographic: query.geographic
      ? filterGeographics.filter(item => query.geographic.split(",").includes(item.value))
      : [],
    begin: query.begin ? DUMMY_YEAR.find(item => item.value === query.begin) : undefined,
    end: query.end ? DUMMY_YEAR.find(item => item.value === query.end) : undefined,
    source: query.source
      ? filterSources.filter(item => query.source.split(",").includes(item.value))
      : [],
    search: query.search ?? "",
  });

  const reset = () => {
    setFilter("period", undefined);
    setFilter("geographic", []);
    setFilter("begin", undefined);
    setFilter("end", undefined);
    setFilter("source", []);
  };

  return (
    <div className="sticky top-14 flex items-center justify-between gap-2 border-b bg-white py-4">
      <div className="flex-grow">
        <Input
          className="border-0 pl-10"
          type="search"
          placeholder={t("catalogue.search_placeholder")}
          autoFocus
          value={filter.search}
          onChange={e => setFilter("search", e)}
          icon={<MagnifyingGlassIcon className="h-4 w-4 lg:h-5 lg:w-5" />}
        />
      </div>
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
          title={
            <Label
              label={t("catalogue.filter") + ":"}
              className="block text-sm font-medium text-black"
            />
          }
          fullScreen
        >
          {close => (
            <div className="flex-grow space-y-4 divide-y overflow-y-auto pb-28">
              <Radio
                label={t("catalogue.period")}
                name="period"
                className="flex flex-wrap gap-4 px-1 pt-2"
                options={filterPeriods}
                value={filter.period}
                onChange={e => setFilter("period", e)}
              />
              <Checkbox
                label={t("catalogue.geographic")}
                className="flex flex-wrap gap-4 px-1 pt-2"
                name="geographic"
                options={filterGeographics}
                value={filter.geographic}
                onChange={e => setFilter("geographic", e)}
              />

              <div className="grid grid-cols-2 gap-4">
                <Dropdown
                  width="w-full"
                  label={t("catalogue.begin")}
                  sublabel={t("catalogue.begin") + ":"}
                  options={filterYears(2010, new Date().getFullYear())}
                  selected={filter.begin}
                  placeholder={t("common.select")}
                  onChange={e => setFilter("begin", e)}
                />
                <Dropdown
                  label={t("catalogue.end")}
                  sublabel={t("catalogue.end") + ":"}
                  width="w-full"
                  disabled={!filter.begin}
                  options={
                    filter.begin ? filterYears(+filter.begin.value, new Date().getFullYear()) : []
                  }
                  selected={filter.end}
                  placeholder={t("common.select")}
                  onChange={e => setFilter("end", e)}
                />
              </div>

              <Checkbox
                label={t("catalogue.source")}
                className="space-y-4 px-1 pt-4"
                name="source"
                options={filterSources}
                value={filter.source}
                onChange={e => setFilter("source", e)}
              />

              <div className="fixed bottom-0 left-0 w-full space-y-2 bg-white py-3 px-2">
                <Button
                  className="w-full justify-center bg-red-500 text-white disabled:bg-opacity-50 disabled:text-black"
                  disabled={!actives.length}
                  onClick={reset}
                >
                  {t("common.reset")}
                </Button>
                <Button
                  className="w-full justify-center bg-outline py-1.5"
                  icon={<XMarkIcon className="h-4 w-4" />}
                  onClick={close}
                >
                  {t("common.close")}
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>

      {/* Desktop */}
      <div className="hidden gap-2 lg:flex">
        {actives.length > 0 && (
          <div>
            <Button
              icon={<XMarkIcon className="h-4 w-4" />}
              disabled={!actives.length}
              onClick={reset}
            >
              {t("common.clear_all")}
            </Button>
          </div>
        )}
        <Dropdown
          options={filterPeriods}
          placeholder={t("catalogue.period")}
          selected={filter.period}
          onChange={e => setFilter("period", e)}
        />
        <Dropdown
          multiple
          title={t("catalogue.geographic")}
          options={filterGeographics}
          selected={filter.geographic}
          onChange={e => setFilter("geographic", e)}
        />

        <Dropdown
          sublabel={t("catalogue.begin") + ":"}
          options={filterYears(2010, new Date().getFullYear())}
          selected={filter.begin}
          placeholder={t("common.select")}
          onChange={e => setFilter("begin", e)}
        />
        <Dropdown
          disabled={!filter.begin}
          sublabel={t("catalogue.end") + ":"}
          options={filter.begin ? filterYears(+filter.begin.value, new Date().getFullYear()) : []}
          selected={filter.end}
          placeholder={t("common.select")}
          onChange={e => setFilter("end", e)}
        />
        <Dropdown
          multiple
          title={t("catalogue.source")}
          options={filterSources}
          selected={filter.source}
          onChange={e => setFilter("source", e)}
        />
      </div>
    </div>
  );
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

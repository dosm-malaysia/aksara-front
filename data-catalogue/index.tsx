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
          {/* <Section title={"Category"}>
            <ul className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-3">
              {dummy(11).map((item, index) => (
                <li key={index}>
                  <At href={item.href} className="text-primary underline hover:no-underline">
                    {item.name}
                  </At>
                </li>
              ))}
            </ul>
          </Section> */}
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

          {/* <Section title={"Education"}>
            <ul className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-3">
              {dummy(11).map((item, index) => (
                <li key={index}>
                  <At href={item.href} className="text-primary underline hover:no-underline">
                    {item.name}
                  </At>
                </li>
              ))}
            </ul>
          </Section> */}
        </Container>
      </div>
    </>
  );
};

interface CatalogueFilterProps {
  query: Record<string, any>;
}

const CatalogueFilter: FunctionComponent<CatalogueFilterProps> = ({ query }) => {
  const { filter, setFilter, actives } = useFilter({
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

  const reset = () => {
    setFilter("period", undefined);
    setFilter("geographic", []);
    setFilter("begin", undefined);
    setFilter("datapoint", undefined);
    setFilter("source", []);
  };

  return (
    <div className="sticky top-14 flex items-center justify-between gap-2 border-b bg-white py-4">
      <Input
        className="border-0 pl-10"
        type="search"
        placeholder="Search for dataset"
        autoFocus
        value={filter.search}
        onChange={e => setFilter("search", e)}
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
                value={filter.period}
                onChange={e => setFilter("period", e)}
              />
              <Checkbox
                label="Geographic"
                className="flex flex-wrap gap-y-4 gap-x-5 px-1 pt-2"
                name="geographic"
                options={DUMMY_GEO}
                value={filter.geographic}
                onChange={e => setFilter("geographic", e)}
              />

              <div className="grid grid-cols-2 gap-4">
                <Dropdown
                  width="w-full"
                  label="Dataset Begin"
                  sublabel="Begin:"
                  options={DUMMY_YEAR}
                  selected={filter.begin}
                  onChange={e => setFilter("begin", e)}
                />
                <Dropdown
                  label="Recent Datapoint"
                  sublabel="Datapoint:"
                  width="w-full"
                  options={DUMMY_YEAR}
                  selected={filter.datapoint}
                  onChange={e => setFilter("datapoint", e)}
                />
              </div>

              <div className="pt-2">
                <Input
                  label="Data Source"
                  type="search"
                  className="w-full appearance-none rounded-lg border border-outline bg-white pl-8 pr-2 text-sm outline-none focus:border-outline focus:outline-none focus:ring-0 md:text-base"
                  placeholder="Search for dataset"
                  value={filter.search}
                  onChange={e => setFilter("search", e)}
                  icon={<MagnifyingGlassIcon className="h-4 w-4 lg:h-5 lg:w-5" />}
                />
                <Checkbox
                  className="space-y-4 px-1"
                  name="source"
                  options={DUMMY_GEO}
                  value={filter.source}
                  onChange={e => setFilter("source", e)}
                />
              </div>
              <div className="fixed bottom-0 left-0 w-full space-y-2 bg-white py-3 px-2">
                <Button
                  className="w-full justify-center bg-red-500 font-medium text-white disabled:bg-opacity-50"
                  disabled={!actives.length}
                  onClick={() => {
                    reset();
                    // close();
                  }}
                >
                  Reset
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
      <div className="hidden gap-2 lg:flex">
        <Dropdown
          options={DUMMY_PERIOD}
          placeholder="Period"
          selected={filter.period}
          onChange={e => setFilter("period", e)}
        />
        <Dropdown
          multiple
          title="Geographic"
          options={DUMMY_GEO}
          selected={filter.geographic}
          onChange={e => setFilter("geographic", e)}
        />

        <Dropdown
          sublabel="Begin"
          options={DUMMY_YEAR}
          selected={filter.begin}
          onChange={e => setFilter("begin", e)}
        />
        <Dropdown
          sublabel="Datapoint"
          options={DUMMY_YEAR}
          selected={filter.datapoint}
          onChange={e => setFilter("datapoint", e)}
        />
        <Dropdown
          multiple
          title="Data Source"
          options={DUMMY_GEO}
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

import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Page } from "@lib/types";
import {
  CodeBlock,
  Container,
  Dropdown,
  Metadata,
  Section,
  StateDropdown,
} from "@components/index";
import { DocumentArrowDownIcon, CloudArrowDownIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "next-i18next";
import { FunctionComponent, ReactNode } from "react";
import { showChart } from "@lib/options";
import Card from "@components/Card";
import { useData } from "@hooks/useData";

const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });
const Table = dynamic(() => import("@components/Chart/Table"), { ssr: false });

const CatalogueShow: Page = ({ query }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation();
  const { data, setData } = useData({
    show: showChart[0],
    download: undefined,
  });

  /**
   * @todo Chart parser function, parse data given to its chart component.
   */

  const availableDownloads: { chart: DownloadCard[]; data: DownloadCard[] } = {
    chart: [
      {
        key: "png",
        image: "",
        title: "Image (PNG)",
        description: "Suitable for general digital use.",
        icon: <CloudArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
      },
      {
        key: "svg",
        image: "",
        title: "Vector Graphic (SVG)",
        description: "Suitable for high quality prints or further editing of chart.",
        icon: <CloudArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
      },
    ],
    data: [
      {
        key: "csv",
        image: "",
        title: "Full Dataset (CSV)",
        description: "Recommended for individuals seeking an Excel-friendly format.",
        icon: <DocumentArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
      },
      {
        key: "parquet",
        image: "",
        title: "Full Dataset (Parquet)",
        description: "Recommended for data scientists seeking to work with the data via code.",
        icon: <DocumentArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
      },
    ],
  };

  return (
    <>
      <Metadata title={t("nav.catalogue")} description={""} keywords={""} />
      <div>
        <Container className="mx-auto w-full pt-6 md:max-w-screen-md lg:max-w-screen-lg">
          {/* Chart */}
          <Section
            title="Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
            className=""
            date={"2008-10-29 14:56:59"}
            menu={
              <>
                <Dropdown
                  sublabel={<EyeIcon className="h-4 w-4" />}
                  selected={data.show}
                  options={showChart}
                  onChange={e => setData("show", e)}
                />
                <Dropdown
                  sublabel={<DocumentArrowDownIcon className="h-4 w-4" />}
                  placeholder="Download"
                  selected={data.download}
                  options={[...availableDownloads.chart, ...availableDownloads.data].map(item => ({
                    label: item.title,
                    value: item.key,
                  }))}
                  onChange={e => setData("download", e)}
                />
              </>
            }
          >
            {
              {
                chart: <Timeseries />, // @todo: Chart parser function goes here
                table: <Table />,
              }[data.show.value as string]
            }
          </Section>

          {/* How is this data produced? */}
          <Section title={"How is this data produced?"} className="py-12">
            <p className="text-dim">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum
              dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
              labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
              ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
              magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
              ut aliquip ex ea commodo consequat.
            </p>
          </Section>
          {/* Are there any pitfalls I should bear in mind when using this data? */}
          <Section
            title={"Are there any pitfalls I should bear in mind when using this data?"}
            className="border-b pb-12"
          >
            <p className="text-dim">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum
              dolor sit amet, consectetur adipiscing elit.
            </p>
          </Section>

          {/* Metadata */}
          <Section title={"Metadata"} className="mx-auto w-full border-b py-12 ">
            <Card type="gray">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h5>Dataset description</h5>
                  <p className="text-dim">
                    The dataset containing the variable displayed above is a dataset on COVID-19
                    cases in Malaysia, with breakdowns available by age, sex, ethnicity, and state,
                    which is updated every day. The dataset is fully consistent with all other
                    datasets ....
                  </p>
                </div>
                <div className="space-y-3">
                  <h5>Variable definitions</h5>
                  <p className="text-dim">
                    The dataset containing the variable displayed above is a dataset on COVID-19
                    cases in Malaysia, with breakdowns available by age, sex, ethnicity, and state,
                    which is updated every day. The dataset is fully consistent with all other
                    datasets ....
                  </p>
                </div>
                <div className="space-y-3">
                  <h5>Last updated</h5>
                  <p className="whitespace-pre-line text-dim">
                    The dataset containing the variable displayed above is a dataset on COVID-19
                    cases in Malaysia, with breakdowns available by age, sex, ethnicity, and state,
                    which is updated every day. The dataset is fully consistent with all other
                    datasets ....
                  </p>
                </div>
                <div className="space-y-3">
                  <h5>Next update</h5>
                  <p className="text-dim">
                    The dataset containing the variable displayed above is a dataset on COVID-19
                    cases in Malaysia, with breakdowns available by age, sex, ethnicity, and state,
                    which is updated every day. The dataset is fully consistent with all other
                    datasets ....
                  </p>
                </div>
                <div className="space-y-3">
                  <h5>Data source(s)</h5>
                  <p className="text-dim">
                    The dataset containing the variable displayed above is a dataset on COVID-19
                    cases in Malaysia, with breakdowns available by age, sex, ethnicity, and state,
                    which is updated every day. The dataset is fully consistent with all other
                    datasets ....
                  </p>
                </div>
                <div className="space-y-3">
                  <h5>URLs to dataset</h5>
                  <p className="text-dim">
                    The dataset containing the variable displayed above is a dataset on COVID-19
                    cases in Malaysia, with breakdowns available by age, sex, ethnicity, and state,
                    which is updated every day. The dataset is fully consistent with all other
                    datasets ....
                  </p>
                </div>
              </div>
            </Card>
          </Section>

          {/* Download */}
          <Section title={"Download"} className="mx-auto w-full border-b py-12 ">
            <div className="space-y-5">
              <h5>Chart</h5>
              <div className="grid grid-cols-1 gap-4.5 md:grid-cols-2">
                {availableDownloads.chart.map(props => (
                  <DownloadCard {...props} />
                ))}
              </div>
              <h5>Data</h5>
              <div className="grid grid-cols-1 gap-4.5 md:grid-cols-2">
                {availableDownloads.data.map(props => (
                  <DownloadCard {...props} />
                ))}
              </div>
            </div>
          </Section>

          {/* Code */}
          <Section
            title={"Code"}
            description="Connect directly to the data using various programming languages"
            className="mx-auto w-full border-b py-12 "
          >
            <CodeBlock />
          </Section>
        </Container>
      </div>
    </>
  );
};

interface DownloadCard {
  key: string;
  href?: string;
  image?: string;
  title: string;
  description?: string;
  icon?: ReactNode;
}

const DownloadCard: FunctionComponent<DownloadCard> = ({
  href = "#",
  image,
  title,
  description,
  icon,
}) => {
  return (
    <a href={href} download>
      <Card className="rounded-md border border-outline bg-background px-4.5 py-5">
        <div className="flex items-center gap-4.5">
          {image && <img src={image} alt={title} />}
          <div className="block flex-grow">
            <p className="font-bold">{title}</p>
            {description && <p className="text-sm text-dim">{description}</p>}
          </div>
          {icon && icon}
        </div>
      </Card>
    </a>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale, query }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);

  // const { data } = await  // your fetch function here

  return {
    props: {
      ...i18n,
      query: query ?? {},
    },
  };
};

export default CatalogueShow;

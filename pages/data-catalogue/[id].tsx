import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type { Page, DownloadOptions, DownloadOption } from "@lib/types";
import {
  At,
  CodeBlock,
  Container,
  Dropdown,
  Metadata,
  Search,
  Section,
  Tooltip,
} from "@components/index";
import { DocumentArrowDownIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "next-i18next";
import { FunctionComponent, ReactNode, useEffect, useState } from "react";
import Card from "@components/Card";
import { get } from "@lib/api";
import { SHORT_LANG } from "@lib/constants";
import { download, toDate, eventTrack } from "@lib/helpers";
import { CATALOGUE_TABLE_SCHEMA, UNIVERSAL_TABLE_SCHEMA } from "@lib/schema/data-catalogue";
import { OptionType } from "@components/types";

const Table = dynamic(() => import("@components/Chart/Table"), { ssr: false });
const CatalogueTimeseries = dynamic(() => import("@data-catalogue/timeseries"), {
  ssr: false,
});
const CatalogueChoropleth = dynamic(() => import("@data-catalogue/choropleth"), {
  ssr: true,
});

const CatalogueShow: Page = ({
  params,
  config,
  dataset,
  explanation,
  metadata,
  urls,
  query,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t, i18n } = useTranslation();
  const showChart =
    dataset.type === "TABLE"
      ? [{ label: t("catalogue.table"), value: "table" }]
      : [
          { label: t("catalogue.chart"), value: "chart" },
          { label: t("catalogue.table"), value: "table" },
        ];

  const [show, setShow] = useState<OptionType>(showChart[0]);
  const [downloads, setDownloads] = useState<DownloadOptions>({
    chart: [],
    data: [],
  });
  const lang: keyof typeof SHORT_LANG = SHORT_LANG[i18n.language];

  const renderChart = (): ReactNode | undefined => {
    switch (dataset.type) {
      case "TIMESERIES":
        return (
          <CatalogueTimeseries
            params={params}
            dataset={dataset}
            filter_state={config.filter_state}
            filter_mapping={config.filter_mapping}
            lang={lang as "en" | "bm"}
            urls={urls}
            onDownload={prop => setDownloads(prop)}
          />
        );

      case "CHOROPLETH":
        return (
          <CatalogueChoropleth
            dataset={dataset}
            lang={lang as "en" | "bm"}
            urls={urls}
            config={{
              color: config.color,
              geojson: config.file_json,
            }}
            onDownload={prop => setDownloads(prop)}
          />
        );
      default:
        break;
    }
    return;
  };

  useEffect(() => {
    if (dataset.type === "TABLE") {
      setDownloads({
        chart: [],
        data: [
          {
            key: "file/csv",
            image: "/static/images/icons/csv.png",
            title: t("catalogue.csv.title"),
            description: t("catalogue.csv.desc"),
            icon: <DocumentArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
            href: urls.csv,
          },
          {
            key: "file/parquet",
            image: "/static/images/icons/parquet.png",
            title: t("catalogue.parquet.title"),
            description: t("catalogue.parquet.desc"),
            icon: <DocumentArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
            href: urls.parquet,
          },
        ],
      });
    }
  }, []);

  return (
    <>
      <Metadata
        title={dataset.meta[lang].title}
        description={dataset.meta[lang].desc.replace(/^(.*?)]/, "")}
        keywords={""}
      />
      <div>
        <Container className="mx-auto w-full pt-6 md:max-w-screen-md lg:max-w-screen-lg">
          {/* Chart & Table */}
          <Section
            title={dataset.meta[lang].title}
            className=""
            description={dataset.meta[lang].desc.replace(/^(.*?)]/, "")}
            date={metadata.data_as_of}
            menu={
              <>
                <Dropdown
                  sublabel={<EyeIcon className="h-4 w-4" />}
                  selected={show}
                  options={showChart}
                  onChange={e => setShow(e)}
                />
                <Dropdown
                  sublabel={<DocumentArrowDownIcon className="h-4 w-4" />}
                  placeholder={t("catalogue.download")}
                  options={
                    downloads
                      ? [...downloads.chart, ...downloads.data].map(item => ({
                          label: item.title,
                          value: item.key,
                        }))
                      : []
                  }
                  onChange={async e => {
                    const action =
                      downloads &&
                      [...downloads?.chart, ...downloads?.data].find(({ key }) => e.value === key)
                        ?.href;

                    return typeof action === "string"
                      ? download(action, {
                          category: e.key,
                          label: dataset.meta[lang].title,
                          value: dataset.meta.unique_id,
                        })
                      : action
                      ? action()
                      : null;
                  }}
                />
              </>
            }
          >
            {/* Dataset Filters & Chart / Table */}
            <div className={[show.value === "chart" ? "block" : "hidden", "space-y-2"].join(" ")}>
              {renderChart()}
            </div>
            <div
              className={["mx-auto", ...[show.value === "table" ? "block" : "hidden"]].join(" ")}
            >
              <Table
                className="table-stripe table-default"
                data={[...dataset.table.data].reverse()}
                enableSticky
                search={
                  dataset.type === "TABLE"
                    ? onSearch => (
                        <Search
                          className="w-full lg:w-auto"
                          onChange={query => onSearch(query ?? "")}
                        />
                      )
                    : undefined
                }
                config={
                  dataset.type === "TABLE"
                    ? UNIVERSAL_TABLE_SCHEMA(
                        dataset.table.columns,
                        lang as "en" | "bm",
                        config.freeze
                      )
                    : CATALOGUE_TABLE_SCHEMA(dataset.table.columns, lang)
                }
                enablePagination
              />
            </div>
          </Section>

          {/* How is this data produced? */}
          <Section title={t("catalogue.header_1")} className="py-12">
            <p className="whitespace-pre-line text-dim">{explanation[lang].methodology}</p>
          </Section>

          {/* Are there any pitfalls I should bear in mind when using this data? */}
          <Section title={t("catalogue.header_2")} className="border-b pb-12">
            <p className="whitespace-pre-line text-dim">{explanation[lang].caveat}</p>
          </Section>

          {/* Metadata */}
          <Section title={"Metadata"} className="mx-auto w-full border-b pt-12 ">
            <Card type="gray">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h5>{t("catalogue.meta_desc")}</h5>
                  <p className="text-dim">{metadata.dataset_desc[lang]}</p>
                </div>
                <div className="space-y-3">
                  <h5>{t("catalogue.meta_def")}</h5>

                  <div className="space-y-6">
                    {/* In the chart above: */}
                    {metadata.in_dataset?.length > 0 && (
                      <div>
                        <p className="font-bold text-dim">{t("catalogue.meta_chart_above")}</p>
                        <ul className="ml-6 list-outside list-disc pt-2 text-dim">
                          {metadata.in_dataset?.map((item: { [x: string]: string }) => (
                            <li key={item.id}>
                              <div className="flex flex-wrap gap-x-3">
                                <span>{item[`title_${lang}`]}</span>
                                <Tooltip tip={item[`desc_${lang}`]} />
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {/* In the dataset above: */}
                    {metadata.out_dataset?.length > 0 && (
                      <div>
                        <p className="font-bold text-dim">{t("catalogue.meta_all_dataset")}</p>
                        <ul className="ml-6 list-outside list-disc space-y-1 pt-2 text-dim">
                          {metadata.out_dataset.map((item: { [x: string]: string }) => (
                            <li key={item.id}>
                              <div className="flex flex-wrap gap-x-3">
                                {item?.unique_id ? (
                                  <At
                                    href={`/data-catalogue/${item.unique_id}`}
                                    className="hover:underline"
                                  >
                                    {item[`title_${lang}`]}
                                  </At>
                                ) : (
                                  <p> {item[`title_${lang}`]}</p>
                                )}

                                <Tooltip tip={item[`desc_${lang}`]} />
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                {/* Last updated */}
                <div className="space-y-3">
                  <h5>{t("common.last_updated", { date: "" })}</h5>
                  <p className="whitespace-pre-line text-dim">
                    {toDate(metadata.last_updated, "dd MMM yyyy, HH:mm", i18n.language)}
                  </p>
                </div>
                {/* Next update */}
                <div className="space-y-3">
                  <h5>{t("common.next_update", { date: "" })}</h5>
                  <p className="text-dim">
                    {toDate(metadata.next_update, "dd MMM yyyy, HH:mm", i18n.language)}
                  </p>
                </div>
                {/* Data Source */}
                <div className="space-y-3">
                  <h5>{t("catalogue.meta_source")}</h5>
                  <ul className="ml-6 list-outside list-disc text-dim">
                    <li>{metadata.data_source}</li>
                  </ul>
                </div>
                {/* URLs to dataset */}
                <div className="space-y-3">
                  <h5>{t("catalogue.meta_url")}</h5>
                  <ul className="ml-6 list-outside list-disc text-dim">
                    {Object.values(metadata.url).map((url: any) => (
                      <li key={url}>
                        <a
                          href={url}
                          className="break-all text-primary underline hover:no-underline"
                        >
                          {url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </Section>

          {/* Download */}
          <Section title={t("catalogue.download")} className="mx-auto w-full border-b py-12 ">
            <div className="space-y-5">
              {downloads!.chart?.length > 0 && (
                <>
                  <h5>{t("catalogue.chart")}</h5>
                  <div className="grid grid-cols-1 gap-4.5 md:grid-cols-2">
                    {downloads?.chart.map(props => (
                      <DownloadCard
                        event={{ label: dataset.meta[lang].title, value: dataset.meta.unique_id }}
                        {...props}
                      />
                    ))}
                  </div>
                </>
              )}
              {downloads!.data?.length > 0 && (
                <>
                  <h5>Data</h5>
                  <div className="grid grid-cols-1 gap-4.5 md:grid-cols-2">
                    {downloads?.data.map(props => (
                      <DownloadCard
                        event={{ label: dataset.meta[lang].title, value: dataset.meta.unique_id }}
                        {...props}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </Section>

          {/* Code */}
          <Section
            title={t("catalogue.code")}
            description={t("catalogue.code_desc")}
            className="mx-auto w-full border-b py-12 "
          >
            <CodeBlock url={urls.parquet} />
          </Section>
        </Container>
      </div>
    </>
  );
};
interface DownloadCard extends DownloadOption {
  event: {
    label: string;
    value: string;
  };
}

const DownloadCard: FunctionComponent<DownloadCard> = ({
  href,
  image,
  title,
  description,
  icon,
  event,
}) => {
  return typeof href === "string" ? (
    <a
      href={href}
      download
      onClick={() =>
        eventTrack({
          action: "file_download",
          category: (href as string).includes("csv") ? "file/csv" : "file/parquet",
          label: event.label,
          value: event.value,
        })
      }
    >
      <Card className="rounded-md border border-outline bg-background px-4.5 py-5">
        <div className="flex items-center gap-4.5">
          {image && <img src={image} className="h-16 w-auto object-contain" alt={title} />}
          <div className="block flex-grow">
            <p className="font-bold">{title}</p>
            {description && <p className="text-sm text-dim">{description}</p>}
          </div>
          {icon && icon}
        </div>
      </Card>
    </a>
  ) : (
    <Card className="rounded-md border border-outline bg-background px-4.5 py-5" onClick={href}>
      <div className="flex items-center gap-4.5">
        {image && (
          <img
            src={image}
            className="h-14 min-w-[4rem] rounded border bg-white object-cover lg:h-16"
            alt={title}
          />
        )}
        <div className="block flex-grow">
          <p className="font-bold">{title}</p>
          {description && <p className="text-sm text-dim">{description}</p>}
        </div>
        {icon && icon}
      </div>
    </Card>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale, query, params }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);

  const { data } = await get("/data-variable/", { id: params!.id, ...query });
  let filter_state;

  if (data.API.chart_type === "TIMESERIES") {
    filter_state = Object.fromEntries(
      data.API.filters.map((filter: any) => [
        filter.key,
        filter.options.find((item: OptionType) => item.value === query[filter.key]) ??
          filter.default,
      ])
    );
  }

  return {
    props: {
      ...i18n,
      config: {
        filter_state: filter_state ?? {},
        filter_mapping: data.API.filters ?? {},
        ...data.API,
      },
      query: query ?? {},
      params: params,
      dataset: {
        type: data.API.chart_type,
        chart: data.chart_details.chart_data ?? {},
        table: data.chart_details.table_data,
        meta: data.chart_details.intro,
      },
      explanation: data.explanation,
      metadata: data.metadata,
      urls: data.downloads,
    },
  };
};

export default CatalogueShow;
/** ------------------------------------------------------------------------------------------------------------- */

import type { DownloadOptions, DownloadOption } from "@lib/types";
import type { TableConfig } from "@components/Chart/Table";
import { DocumentArrowDownIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "next-i18next";
import { FunctionComponent, ReactNode, useEffect, useState } from "react";
import { SHORT_LANG } from "@lib/constants";
import { download, toDate } from "@lib/helpers";
import { CATALOGUE_TABLE_SCHEMA, UNIVERSAL_TABLE_SCHEMA } from "@lib/schema/data-catalogue";
import { OptionType } from "@components/types";
import { track } from "@lib/mixpanel";
import dynamic from "next/dynamic";
import Card from "@components/Card";
import At from "@components/At";
import CodeBlock from "@components/CodeBlock";
import Container from "@components/Container";
import Dropdown from "@components/Dropdown";
import Search from "@components/Search";
import Section from "@components/Section";
import Tooltip from "@components/Tooltip";
import { useRouter } from "next/router";

const Table = dynamic(() => import("@components/Chart/Table"), { ssr: false });
const CatalogueTimeseries = dynamic(() => import("@data-catalogue/timeseries"), {
  ssr: false,
});
const CatalogueChoropleth = dynamic(() => import("@data-catalogue/choropleth"), {
  ssr: true,
});

interface CatalogueShowProps {
  params: {
    id: string;
  };
  config: any;
  dataset: any;
  explanation: any;
  metadata: any;
  urls: {
    csv: string;
    parquet: string;
  };
}

const CatalogueShow: FunctionComponent<CatalogueShowProps> = ({
  params,
  config,
  dataset,
  explanation,
  metadata,
  urls,
}) => {
  const { t, i18n } = useTranslation();
  let showChart, datasets;
  if (dataset.type === "TABLE") {
    showChart = [{ label: t("catalogue.table"), value: "table" }];
    datasets = metadata.out_dataset;
  } else {
    showChart = [
      { label: t("catalogue.chart"), value: "chart" },
      { label: t("catalogue.table"), value: "table" },
    ];
    datasets = [...metadata?.in_dataset, ...metadata?.out_dataset];
  }
  const [show, setShow] = useState<OptionType>(showChart[0]);
  const [downloads, setDownloads] = useState<DownloadOptions>({
    chart: [],
    data: [],
  });

  const query = useRouter().query;
  const lang = SHORT_LANG[i18n.language] as "en" | "bm";

  const renderChart = (): ReactNode | undefined => {
    switch (dataset.type) {
      case "TIMESERIES":
        return (
          <CatalogueTimeseries
            params={params}
            dataset={dataset}
            filter_state={config.filter_state}
            filter_mapping={config.filter_mapping}
            lang={lang}
            urls={urls}
            onDownload={prop => setDownloads(prop)}
          />
        );

      case "CHOROPLETH":
        return (
          <CatalogueChoropleth
            dataset={dataset}
            lang={lang}
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
    track("page_view", {
      type: "catalogue",
      id: dataset.meta.unique_id,
      name_en: dataset.meta.en.title,
      name_bm: dataset.meta.bm.title,
    });
    if (dataset.type === "TABLE") {
      setDownloads({
        chart: [],
        data: [
          {
            key: "csv",
            image: "/static/images/icons/csv.png",
            title: t("catalogue.csv.title"),
            description: t("catalogue.csv.desc"),
            icon: <DocumentArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
            href: urls.csv,
          },
          {
            key: "parquet",
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

  const tableConfig: TableConfig[] = [
    {
      id: "variable_name",
      header: t("catalogue.meta_variable_name"),
      accessorFn: (item: any) => JSON.stringify({ uid: item.uid, name: item.variable_name }),
      className: "text-left",
      enableSorting: false,
      cell: (value: any) => {
        const [item, index] = [JSON.parse(value.getValue()), value.row.index];
        return (
          <>
            {Boolean(item.uid) ? (
              <At href={`/data-catalogue/${item.uid}`} className="hover:underline">
                {item.name}
              </At>
            ) : (
              <p>{item.name}</p>
            )}
            {index === 0 && (
              <p className="font-normal text-dim">
                <i>{t("catalogue.meta_chart_above")}</i>
              </p>
            )}
          </>
        );
      },
    },
    {
      id: "variable",
      header: t("catalogue.meta_variable"),
      accessorFn({ variable, data_type }) {
        return `${variable}//${data_type ? `(${data_type})` : ""}`;
      },
      cell: (value: any) => {
        const [variable, data_type] = value.getValue().split("//");
        return (
          <p className="font-mono text-sm">
            {variable} {data_type}
          </p>
        );
      },
      className: "text-left",
      enableSorting: false,
    },
    {
      id: "definition",
      header: t("catalogue.meta_definition"),
      accessorKey: "definition",
      className: "text-left",
      enableSorting: false,
    },
  ];

  return (
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
                    [...downloads?.chart, ...downloads?.data].find(({ key }) => e.value === key);

                  return typeof action?.href === "string"
                    ? download(action.href, dataset.meta.unique_id, () =>
                        track("file_download", {
                          uid: dataset.meta.unique_id.concat("_", action.key),
                          type: ["csv", "parquet"].includes(e.value) ? "file" : "image",
                          id: dataset.meta.unique_id,
                          name_en: dataset.meta.en.title,
                          name_bm: dataset.meta.bm.title,
                          ext: action.key,
                        })
                      )
                    : action
                    ? action.href()
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
          <div className={["mx-auto", ...[show.value === "table" ? "block" : "hidden"]].join(" ")}>
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
                  : CATALOGUE_TABLE_SCHEMA(
                      dataset.table.columns,
                      lang,
                      query.range ?? config.filter_state.range
                    )
              }
              enablePagination={15}
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

                {/* In the chart above: */}
                {datasets?.length > 0 && (
                  <>
                    <ul className="ml-6 list-outside list-disc text-dim md:hidden">
                      {datasets?.map((item: { [x: string]: string }) => (
                        <li key={item.id}>
                          <div className="flex flex-wrap gap-x-3">
                            <span>{item[`title_${lang}`]}</span>
                            <Tooltip tip={item[`desc_${lang}`]} />
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="hidden md:block">
                      <Table
                        className="table-slate table-default-slate text-dim"
                        data={datasets.map((item: any) => {
                          const [unclean_data_type, unclean_definition] =
                            item[`desc_${lang}`].split("]");

                          return {
                            id: item.id,
                            uid: item.unique_id,
                            variable: item.name,
                            variable_name: item[`title_${lang}`],
                            data_type: unclean_data_type?.replace("[", "").trim(),
                            definition: unclean_definition?.replace("[", "").trim(),
                          };
                        })}
                        config={tableConfig}
                      />
                    </div>
                  </>
                )}

                {/* In the dataset above:
                  {metadata.out_dataset?.length > 0 && (
                    <div>
                      <p className="font-bold text-dim">{t("catalogue.meta_all_dataset")}</p>
                      <ul className="ml-6 list-outside list-disc space-y-1 pt-2 text-dim md:hidden">
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
                      <div className="hidden pt-2 md:block">
                        <Table
                          className="table-slate table-default-slate text-dim"
                          data={metadata.out_dataset.map((item: any) => {
                            const [unclean_data_type, unclean_definition] =
                              item[`desc_${lang}`].split("]");

                            return {
                              uid: item.unique_id,
                              variable: item.name,
                              variable_name: item[`title_${lang}`],
                              data_type: unclean_data_type?.replace("[", "").trim(),
                              definition: unclean_definition?.replace("[", "").trim(),
                            };
                          })}
                          config={tableConfig}
                        />
                      </div>
                    </div>
                  )} */}
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
                  {Object.entries(metadata.url).map(([key, url]: [string, unknown]) => (
                    <li key={url as string}>
                      <a
                        href={url as string}
                        className="break-all text-primary underline hover:no-underline"
                        onClick={() =>
                          track("file_download", {
                            uid: dataset.meta.unique_id.concat("_", key),
                            id: dataset.meta.unique_id,
                            name_en: dataset.meta.en.title,
                            name_bm: dataset.meta.bm.title,
                            type: "file",
                            ext: key,
                          })
                        }
                      >
                        {url as string}
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
                      meta={{
                        uid: dataset.meta.unique_id.concat("_", props.key),
                        id: dataset.meta.unique_id,
                        name_en: dataset.meta.en.title,
                        name_bm: dataset.meta.bm.title,
                        ext: props.key,
                        type: ["csv", "parquet"].includes(props.key) ? "file" : "image",
                      }}
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
                      meta={{
                        uid: dataset.meta.unique_id.concat("_", props.key),
                        id: dataset.meta.unique_id,
                        name_en: dataset.meta.en.title,
                        name_bm: dataset.meta.bm.title,
                        ext: props.key,
                        type: ["csv", "parquet"].includes(props.key) ? "file" : "image",
                      }}
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
  );
};
interface DownloadCard extends DownloadOption {
  meta: {
    uid: string;
    id: string;
    name_en: string;
    name_bm: string;
    ext: string;
    type: string;
  };
}

const DownloadCard: FunctionComponent<DownloadCard> = ({
  href,
  image,
  title,
  description,
  icon,
  meta,
}) => {
  return typeof href === "string" ? (
    <a href={href} download onClick={() => track("file_download", meta)}>
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
            className="aspect-video h-14 rounded border bg-white object-cover lg:h-16"
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

export default CatalogueShow;

import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Page } from "@lib/types";
import { At, CodeBlock, Container, Dropdown, Metadata, Section, Tooltip } from "@components/index";
import { DocumentArrowDownIcon, CloudArrowDownIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "next-i18next";
import { FunctionComponent, ReactNode, useCallback } from "react";
import { showChart } from "@lib/options";
import Card from "@components/Card";
import { useData } from "@hooks/useData";
import canvasToSvg from "canvas2svg";
import { get } from "@lib/api";
import { CountryAndStates, COVID_COLOR, GRAYBAR_COLOR, SHORT_LANG } from "@lib/constants";
import { download, sortMsiaFirst, toDate, flip, capitalize } from "@lib/helpers";
import { CATALOGUE_TABLE_SCHEMA } from "@lib/schema/data-catalogue";
import { useFilter } from "@hooks/useFilter";
import { OptionType } from "@components/types";

const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });
const Table = dynamic(() => import("@components/Chart/Table"), { ssr: false });

const CatalogueShow: Page = ({
  params,
  filter_mapping,
  dataset,
  explanation,
  metadata,
  downloads,
  query,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t, i18n } = useTranslation();
  const { data, setData } = useData({
    show: showChart[0],
    ctx: undefined,
  });
  const { filter, setFilter, queries } = useFilter(
    {
      range:
        query?.period && filter_mapping?.period
          ? filter_mapping.period.find((item: OptionType) => item.value === query.range)
          : undefined, // period
      filter:
        query?.filter && filter_mapping?.state
          ? filter_mapping.state.find((item: OptionType) => item.value === query.filter)
          : undefined, // state
    },
    {
      id: params.id,
    }
  );

  const lang = SHORT_LANG[i18n.language];

  /**
   * @todo Chart parser function, parse data given to its chart component.
   */

  const availableDownloads = useCallback(
    () => ({
      chart: [
        {
          key: "png",
          image: data.ctx && data.ctx.toBase64Image("image/png", 1),
          title: "Image (PNG)",
          description: "Suitable for general digital use.",
          icon: <CloudArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
          href: () => {
            download(
              data.ctx!.toBase64Image("image/png", 1),
              dataset.meta[lang].title.concat(".png")
            );
          },
        },
        {
          key: "svg",
          image: data.ctx && data.ctx.toBase64Image("image/png", 1),
          title: "Vector Graphic (SVG)",
          description: "Suitable for high quality prints or further editing of dataset.",
          icon: <CloudArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
          href: () => {
            let canvas = canvasToSvg(data.ctx!.canvas.width, data.ctx!.canvas.height);
            canvas.drawImage(data.ctx!.canvas, 0, 0);
            download(
              "data:image/svg+xml;utf8,".concat(canvas.getSerializedSvg()),
              dataset.meta[lang].title.concat(".svg")
            );
          },
        },
      ],
      data: [
        {
          key: "csv",
          image: "/static/images/icons/csv.png",
          title: "Full Dataset (CSV)",
          description: "Recommended for individuals seeking an Excel-friendly format.",
          icon: <DocumentArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
          href: downloads.csv,
        },
        {
          key: "parquet",
          image: "/static/images/icons/parquet.png",
          title: "Full Dataset (Parquet)",
          description: "Recommended for data scientists seeking to work with the data via code.",
          icon: <DocumentArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
          href: downloads.parquet,
        },
      ],
    }),
    [data.ctx]
  );

  return (
    <>
      <Metadata title={t("nav.catalogue")} description={""} keywords={""} />
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
                  selected={data.show}
                  options={showChart}
                  onChange={e => setData("show", e)}
                />
                <Dropdown
                  sublabel={<DocumentArrowDownIcon className="h-4 w-4" />}
                  placeholder="Download"
                  options={[...availableDownloads().chart, ...availableDownloads().data].map(
                    item => ({
                      label: item.title,
                      value: item.key,
                    })
                  )}
                  onChange={async e => {
                    const action = [
                      ...availableDownloads().chart,
                      ...availableDownloads().data,
                    ].find(({ key }) => e.value === key)?.href;

                    return typeof action === "string"
                      ? download(action)
                      : action
                      ? await action()
                      : null;
                  }}
                />
              </>
            }
          >
            {/* Dataset Filters & Chart / Table*/}
            <div className="space-y-2">
              {Object.values(filter_mapping).every(item => !!item) && (
                <div className="flex gap-3">
                  {filter_mapping?.state && (
                    <Dropdown
                      options={filter_mapping?.state}
                      anchor="left"
                      enableFlag
                      placeholder="State"
                      selected={filter.filter}
                      onChange={e => setFilter("filter", e)}
                    />
                  )}
                  {filter_mapping?.period && (
                    <Dropdown
                      options={filter_mapping.period}
                      placeholder="Period"
                      selected={filter.range}
                      onChange={e => setFilter("range", e)}
                    />
                  )}
                </div>
              )}

              <Timeseries
                className={[
                  "h-[600px] w-full",
                  ...[data.show.value === "chart" ? "block" : "hidden"],
                ].join(" ")}
                _ref={ref => setData("ctx", ref)}
                interval={filter.range?.value === "YEARLY" ? "year" : "auto"}
                data={{
                  labels: dataset.chart.x,
                  datasets: [
                    {
                      type: "line",
                      data: dataset.chart.line,
                      borderColor: COVID_COLOR[300],
                      borderWidth: 1.5,
                    },
                    {
                      type: "bar",
                      label: dataset.meta[lang].title,
                      data: dataset.chart.y,
                      backgroundColor: GRAYBAR_COLOR[300],
                    },
                  ],
                }}
              />
              <div
                className={[
                  "mx-auto max-w-screen-sm",
                  ...[data.show.value === "table" ? "block" : "hidden"],
                ].join(" ")}
              >
                <Table
                  className={[
                    "table-stripe ",
                    ...[data.show.value === "table" ? "block" : "hidden"],
                  ].join(" ")}
                  data={[...dataset.table.data].reverse()}
                  config={CATALOGUE_TABLE_SCHEMA(
                    dataset.table.columns,
                    flip(SHORT_LANG)[i18n.language]
                  )}
                  enablePagination
                />
              </div>
            </div>
          </Section>

          {/* How is this data produced? */}
          <Section title={"How is this data produced?"} className="py-12">
            <p className="whitespace-pre-line text-dim">{explanation[lang].methodology}</p>
          </Section>

          {/* Are there any pitfalls I should bear in mind when using this data? */}
          <Section
            title={"Are there any pitfalls I should bear in mind when using this data?"}
            className="border-b pb-12"
          >
            <p className="whitespace-pre-line text-dim">{explanation[lang].caveat}</p>
          </Section>

          {/* Metadata */}
          <Section title={"Metadata"} className="mx-auto w-full border-b pt-12 ">
            <Card type="gray">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h5>Dataset description</h5>
                  <p className="text-dim">{metadata.dataset_desc[lang]}</p>
                </div>
                <div className="space-y-3">
                  <h5>Variable definitions</h5>
                  <div className="space-y-6">
                    <div>
                      <p className="font-bold text-dim">In the chart above:</p>
                      <ul className="ml-6 list-outside list-disc pt-2 text-dim">
                        {metadata.in_dataset.map((item: { [x: string]: string }) => (
                          <li key={item.id} className="space-x-3">
                            <span>{item[`title_${lang}`]}</span>
                            <Tooltip tip={item[`desc_${lang}`]} />
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-bold text-dim">In the entire dataset:</p>
                      <ul className="ml-6 list-outside list-disc space-y-1 pt-2 text-dim">
                        {metadata.out_dataset.map((item: { [x: string]: string }) => (
                          <li key={item.id} className="space-x-3">
                            <At
                              href={`/catalogue/${item.unique_id}${queries}`}
                              className="hover:underline"
                            >
                              {item[`title_${lang}`]}
                            </At>
                            <Tooltip tip={item[`desc_${lang}`]} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h5>Last updated</h5>
                  <p className="whitespace-pre-line text-dim">
                    {toDate(metadata.last_updated, i18n.language, "dd MMM yyyy, HH:mm")}
                  </p>
                </div>
                <div className="space-y-3">
                  <h5>Next update</h5>
                  <p className="text-dim">
                    {toDate(metadata.next_update, i18n.language, "dd MMM yyyy, HH:mm")}
                  </p>
                </div>
                <div className="space-y-3">
                  <h5>Data source(s)</h5>
                  <ul className="ml-6 list-outside list-disc text-dim">
                    <li>{metadata.data_source}</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h5>URLs to dataset</h5>
                  <ul className="ml-6 list-outside list-disc text-dim">
                    {Object.values(metadata.url).map((url: any) => (
                      <li key={url}>
                        <a href={url} className="text-primary underline hover:no-underline">
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
          <Section title={"Download"} className="mx-auto w-full border-b py-12 ">
            <div className="space-y-5">
              <h5>Chart</h5>
              <div className="grid grid-cols-1 gap-4.5 md:grid-cols-2">
                {availableDownloads().chart.map(props => (
                  <DownloadCard {...props} />
                ))}
              </div>
              <h5>Data</h5>
              <div className="grid grid-cols-1 gap-4.5 md:grid-cols-2">
                {availableDownloads().data.map(props => (
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
            <CodeBlock url={downloads.parquet} />
          </Section>
        </Container>
      </div>
    </>
  );
};
interface DownloadCard {
  key: string;
  href?: string | (() => void);
  image?: string;
  title: string;
  description?: string;
  icon?: ReactNode;
}

const DownloadCard: FunctionComponent<DownloadCard> = ({
  href,
  image,
  title,
  description,
  icon,
}) => {
  return typeof href === "string" ? (
    <a href={href} download>
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

  // data transformation
  const filter_mapping = {
    state:
      data.API.mapping &&
      sortMsiaFirst(
        Object.entries(data.API.mapping).map(([key, value]) => ({
          value: value as string,
          label: key,
          code: flip(CountryAndStates)[key],
        })),
        "code"
      ),
    period:
      data.API.range_values &&
      data.API.range_values.map((period: string) => ({
        value: period,
        label: capitalize(period),
      })),
  };

  return {
    props: {
      ...i18n,
      filter_mapping,
      query: query ?? {},
      params: params,
      dataset: {
        type: data.API.chart_type,
        chart: data.chart_details.chart_data,
        table: data.chart_details.table_data,
        meta: data.chart_details.intro,
      },
      explanation: data.explanation,
      metadata: data.metadata,
      downloads: data.downloads,
    },
  };
};

export default CatalogueShow;
/** ------------------------------------------------------------------------------------------------------------- */

import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import dynamic from "next/dynamic";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Page } from "@lib/types";
import {
  At,
  CodeBlock,
  Container,
  Dropdown,
  Metadata,
  Section,
  Tooltip,
  Slider,
  SliderRef,
} from "@components/index";
import { DocumentArrowDownIcon, CloudArrowDownIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "next-i18next";
import { FunctionComponent, ReactNode, useCallback, useRef } from "react";
import Card from "@components/Card";
import { useData } from "@hooks/useData";
import canvasToSvg from "canvas2svg";
import { get } from "@lib/api";
import { COVID_COLOR, GRAYBAR_COLOR, SHORT_LANG, SHORT_PERIOD } from "@lib/constants";
import { download, toDate, flip } from "@lib/helpers";
import { CATALOGUE_TABLE_SCHEMA } from "@lib/schema/data-catalogue";
import { useFilter } from "@hooks/useFilter";
import { OptionType } from "@components/types";
import { useWatch } from "@hooks/useWatch";
import { useSlice } from "@hooks/useSlice";
import { Periods } from "@components/Chart/Timeseries";

const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });
// const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });
const Table = dynamic(() => import("@components/Chart/Table"), { ssr: false });

const CatalogueShow: Page = ({
  params,
  filter_state,
  filter_mapping,
  dataset,
  explanation,
  metadata,
  downloads,
  query,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t, i18n } = useTranslation();
  const showChart = [
    { label: t("catalogue.chart"), value: "chart" },
    { label: t("catalogue.table"), value: "table" },
  ];

  const lang = SHORT_LANG[i18n.language];
  const { data, setData } = useData({
    show: showChart[0],
    ctx: undefined,
    minmax: [0, dataset.chart.x.length - 1],
  });
  const { coordinate } = useSlice(
    {
      x: dataset.chart.x,
      y: dataset.chart.y,
      line: dataset.chart.line,
    },
    data.minmax
  );
  const sliderRef = useRef<SliderRef>(null);
  const { filter, setFilter, queries } = useFilter(filter_state, { id: params.id });

  const availableDownloads = useCallback(
    () => ({
      chart: [
        {
          key: "png",
          image: data.ctx && data.ctx.toBase64Image("image/png", 1),
          title: t("catalogue.image.title"),
          description: t("catalogue.image.desc"),
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
          title: t("catalogue.vector.title"),
          description: t("catalogue.vector.desc"),
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
          title: t("catalogue.csv.title"),
          description: t("catalogue.csv.desc"),
          icon: <DocumentArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
          href: downloads.csv,
        },
        {
          key: "parquet",
          image: "/static/images/icons/parquet.png",
          title: t("catalogue.parquet.title"),
          description: t("catalogue.parquet.desc"),
          icon: <DocumentArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
          href: downloads.parquet,
        },
      ],
    }),
    [data.ctx]
  );

  useWatch(() => {
    setData("minmax", [0, dataset.chart.x.length - 1]);
    sliderRef.current && sliderRef.current.reset();
  }, [filter.range, dataset.chart.x]);

  /**
   * @todo Chart parser function, parse data given to its chart component.
   */
  const renderChart = (dataset: Record<string, any>): ReactNode | undefined => {
    switch (dataset.type) {
      case "TIMESERIES":
        return (
          <>
            <Timeseries
              className="h-[350px] w-full lg:h-[600px]"
              _ref={ref => setData("ctx", ref)}
              interval={
                filter.range?.value ? (SHORT_PERIOD[filter.range.value] as Periods) : "auto"
              }
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    data: coordinate.y,
                    borderColor: COVID_COLOR[300],
                    borderWidth: 1.5,
                  },
                  {
                    type: "bar",
                    label: dataset.meta[lang].title,
                    data: coordinate.y,
                    backgroundColor: GRAYBAR_COLOR[300],
                  },
                ],
              }}
            />
            <Slider
              ref={sliderRef}
              className="pt-7"
              type="range"
              data={dataset.chart.x}
              value={data.minmax}
              onChange={({ min, max }) => setData("minmax", [min, max])}
            />
          </>
        );

      default:
        break;
    }
    return;
  };

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
                  selected={data.show}
                  options={showChart}
                  onChange={e => setData("show", e)}
                />
                <Dropdown
                  sublabel={<DocumentArrowDownIcon className="h-4 w-4" />}
                  placeholder={t("catalogue.download")}
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
            {/* Dataset Filters & Chart / Table */}
            <div className="space-y-2">
              <div className="flex gap-3">
                {filter_mapping?.map((item: any, index: number) => (
                  <Dropdown
                    anchor={index > 0 ? "right" : "left"}
                    options={item.options}
                    placeholder="Period"
                    selected={filter[item.key]}
                    onChange={e => setFilter(item.key, e)}
                  />
                ))}
              </div>

              <div className={data.show.value === "chart" ? "block" : "hidden"}>
                {renderChart(dataset)}
              </div>
              <div
                className={[
                  "mx-auto max-w-screen-sm",
                  ...[data.show.value === "table" ? "block" : "hidden"],
                ].join(" ")}
              >
                <Table
                  className="table-stripe"
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
                    <div>
                      {/* In the chart above: */}
                      <p className="font-bold text-dim">{t("catalogue.meta_chart_above")}</p>
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
                      {/* In the dataset above: */}
                      <p className="font-bold text-dim">{t("catalogue.meta_all_dataset")}</p>
                      <ul className="ml-6 list-outside list-disc space-y-1 pt-2 text-dim">
                        {metadata.out_dataset.map((item: { [x: string]: string }) => (
                          <li key={item.id} className="space-x-3">
                            <At
                              href={`/data-catalogue/${item.unique_id}${queries}`}
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
                {/* Last updated */}
                <div className="space-y-3">
                  <h5>{t("common.last_updated", { date: "" })}</h5>
                  <p className="whitespace-pre-line text-dim">
                    {toDate(metadata.last_updated, i18n.language, "dd MMM yyyy, HH:mm")}
                  </p>
                </div>
                {/* Next update */}
                <div className="space-y-3">
                  <h5>{t("common.next_update", { date: "" })}</h5>
                  <p className="text-dim">
                    {toDate(metadata.next_update, i18n.language, "dd MMM yyyy, HH:mm")}
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
          <Section title={t("catalogue.download")} className="mx-auto w-full border-b py-12 ">
            <div className="space-y-5">
              <h5>{t("catalogue.chart")}</h5>
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
            title={t("catalogue.code")}
            description={t("catalogue.code_desc")}
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

  const filter_state = Object.fromEntries(
    data.API.filters.map((filter: any) => [
      filter.key,
      filter.options.find((item: OptionType) => item.value === query[filter.key]) ?? filter.default,
    ])
  );

  return {
    props: {
      ...i18n,
      filter_state,
      filter_mapping: data.API.filters,
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

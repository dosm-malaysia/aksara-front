import type { DownloadOptions } from "@lib/types";
import { ForwardedRef, FunctionComponent, useCallback, useRef } from "react";
import { default as Slider, SliderRef } from "@components/Chart/Slider";
import { default as dynamic } from "next/dynamic";
import { useData } from "@hooks/useData";
import { useSlice } from "@hooks/useSlice";
import { useWatch } from "@hooks/useWatch";
import { AKSARA_COLOR, SHORT_PERIOD } from "@lib/constants";
import { CloudArrowDownIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { download } from "@lib/helpers";
import { useTranslation } from "@hooks/useTranslation";
import canvasToSvg from "canvas2svg";
import { track } from "@lib/mixpanel";
import type { ChartTypeRegistry } from "chart.js";
import type { ChartJSOrUndefined } from "react-chartjs-2/dist/types";

const Bar = dynamic(() => import("@components/Chart/Bar"), { ssr: false });
interface CatalogueBarProps {
  className?: string;
  dataset:
    | {
        chart: {
          x: number[];
          y: number[];
        };
        meta: {
          en: {
            title: string;
          };
          bm: {
            title: string;
          };
        };
      }
    | any;
  urls: {
    [key: string]: string;
  };
  lang: "en" | "bm";
  onDownload?: (prop: DownloadOptions) => void;
}

const CatalogueBar: FunctionComponent<CatalogueBarProps> = ({
  className = "h-[350px] w-full",
  lang,
  dataset,
  urls,

  onDownload,
}) => {
  const { t } = useTranslation();
  const { data, setData } = useData({
    ctx: undefined,
  });

  const availableDownloads = useCallback<() => DownloadOptions>(
    () => ({
      chart: [
        {
          key: "png",
          image: Boolean(data?.ctx) && data.ctx.toBase64Image("png", 1),
          title: t("catalogue.image.title"),
          description: t("catalogue.image.desc"),
          icon: <CloudArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
          href: () => {
            download(data.ctx!.toBase64Image("png", 1), dataset.meta.unique_id.concat(".png"), () =>
              track("file_download", {
                uid: dataset.meta.unique_id.concat("_png"),
                type: "image",
                id: dataset.meta.unique_id,
                name_en: dataset.meta.en.title,
                name_bm: dataset.meta.bm.title,
                ext: "png",
              })
            );
          },
        },
        {
          key: "svg",
          image: Boolean(data?.ctx) && data.ctx.toBase64Image("image/png", 1),
          title: t("catalogue.vector.title"),
          description: t("catalogue.vector.desc"),
          icon: <CloudArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
          href: () => {
            let canvas = canvasToSvg(data.ctx!.canvas.width, data.ctx!.canvas.height);
            canvas.drawImage(data.ctx!.canvas, 0, 0);
            download(
              "data:svg+xml;utf8,".concat(canvas.getSerializedSvg()),
              dataset.meta.unique_id.concat(".svg"),
              () =>
                track("file_download", {
                  uid: dataset.meta.unique_id.concat("_svg"),
                  id: dataset.meta.unique_id,
                  name_en: dataset.meta.en.title,
                  name_bm: dataset.meta.bm.title,
                  type: "image",
                  ext: "svg",
                })
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
    }),
    [data.ctx]
  );

  useWatch(() => {
    onDownload && onDownload(availableDownloads());
  }, [dataset.chart.x, data.ctx]);

  return (
    <>
      <Bar
        className={className}
        _ref={ref => setData("ctx", ref)}
        layout={dataset.type === "BAR" ? "vertical" : "horizontal"}
        type="category"
        enableGridX={false}
        formatX={value =>
          !t(`catalogue.keys.bar.${value}`).includes(".bar")
            ? t(`catalogue.keys.bar.${value}`)
            : value
        }
        data={{
          labels: dataset.chart.x,
          datasets: [
            {
              data: dataset.chart.y,
              label: dataset.meta[lang].title,
              borderColor: AKSARA_COLOR.PRIMARY,
              backgroundColor: AKSARA_COLOR.PRIMARY_H,
              borderWidth: 1,
            },
          ],
        }}
      />
    </>
  );
};

export default CatalogueBar;

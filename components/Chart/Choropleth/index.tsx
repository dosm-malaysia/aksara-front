import { FeatureAccessor, ResponsiveChoropleth } from "@nivo/geo";
import { FunctionComponent, useMemo, useRef, useEffect, Suspense } from "react";
import { default as ChartHeader, ChartHeaderProps } from "@components/Chart/ChartHeader";
import ParliamentDesktop from "@lib/geojson/parlimen_desktop.json";
import ParliamentMobile from "@lib/geojson/parlimen_mobile.json";
import DunDesktop from "@lib/geojson/dun_desktop.json";
import DunMobile from "@lib/geojson/dun_mobile.json";
import StateDesktop from "@lib/geojson/state_desktop.json";
import StateMobile from "@lib/geojson/state_mobile.json";
import { numFormat } from "@lib/helpers";
import { BREAKPOINTS } from "@lib/constants";
import { ColorInterpolatorId } from "@nivo/colors";
import { useWindowWidth } from "@hooks/useWindowWidth";
import { useTranslation } from "next-i18next";
import { useZoom } from "@hooks/useZoom";
import { ArrowPathIcon, MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/outline";

/**
 * Choropleth component
 */

interface ChoroplethProps extends ChartHeaderProps {
  className?: string;
  data?: any;
  unitY?: string;
  enableZoom?: boolean;
  enableScale?: boolean;
  graphChoice?: "state" | "parlimen" | "dun";
  colorScale?: ColorInterpolatorId | string[] | FeatureAccessor<any, string> | string;
  borderWidth?: any;
  borderColor?: any;
  projectionTranslation?: any;
  projectionScaleSetting?: number;
  onReady?: (status: boolean) => void;
}

const Choropleth: FunctionComponent<ChoroplethProps> = ({
  className = "h-[400px]",
  controls,
  menu,
  title,
  data = dummyData,
  unitY,
  graphChoice = "state",
  colorScale,
  borderWidth = 0.25,
  borderColor = "#13293d",
  enableZoom = true,
  onReady,
}) => {
  const { t } = useTranslation();

  const zoomRef = useRef(null);
  const { onWheel, onMove, onDown, onUp, onReset, zoomIn, zoomOut } = useZoom(enableZoom, zoomRef);

  const windowWidth = useWindowWidth();
  const presets = useMemo(
    () => ({
      parlimen: {
        feature:
          windowWidth < BREAKPOINTS.MD ? ParliamentMobile.features : ParliamentDesktop.features,
        projectionScale: windowWidth < BREAKPOINTS.MD ? 1800 : 3400,
        projectionTranslation:
          windowWidth < BREAKPOINTS.MD
            ? ([0.5, 1.05] as [number, number])
            : ([0.67, 0.9] as [number, number]),
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      },
      dun: {
        feature: windowWidth < BREAKPOINTS.MD ? DunMobile.features : DunDesktop.features,
        projectionScale: windowWidth < BREAKPOINTS.MD ? 1800 : 3400,
        projectionTranslation:
          windowWidth < BREAKPOINTS.MD
            ? ([0.5, 1.05] as [number, number])
            : ([0.67, 0.9] as [number, number]),
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      },
      state: {
        feature: windowWidth < BREAKPOINTS.MD ? StateMobile.features : StateDesktop.features,
        projectionScale: windowWidth < BREAKPOINTS.MD ? windowWidth * 4.5 : 3500,
        projectionTranslation:
          windowWidth < BREAKPOINTS.MD
            ? ([0.5, 1.0] as [number, number])
            : ([0.67, 1.0] as [number, number]),
        margin:
          windowWidth < BREAKPOINTS.MD
            ? { top: -30, right: 0, bottom: 0, left: 0 }
            : { top: 0, right: 0, bottom: 0, left: 0 },
      },
    }),
    [windowWidth]
  );

  const config = useMemo(
    () => ({
      feature: presets[graphChoice].feature,
      colors: colorScale,
      margin: presets[graphChoice].margin,
      projectionScale: presets[graphChoice].projectionScale,
      projectionTranslation: presets[graphChoice].projectionTranslation,
      borderWidth: borderWidth,
      borderColor: borderColor,
    }),
    [colorScale, borderWidth, borderColor, windowWidth]
  );

  useEffect(() => {
    if (onReady) onReady(true);
  }, []);
  return (
    <div className="relative">
      <ChartHeader title={title} menu={menu} controls={controls} />

      <div
        className={`border border-outline border-opacity-0 transition-all active:border-opacity-100 ${className}`}
        ref={zoomRef}
        onWheel={onWheel}
        onMouseMove={onMove}
        onMouseDown={onDown}
        onMouseUp={onUp}
        onTouchStart={onDown}
        onTouchEnd={onUp}
        onTouchMove={onMove}
      >
        <ResponsiveChoropleth
          data={data}
          features={config.feature}
          margin={config.margin}
          colors={config.colors}
          domain={[
            Math.min.apply(
              Math,
              data.map((item: any) => item.value)
            ),
            Math.max.apply(
              Math,
              data.map((item: any) => item.value)
            ),
          ]}
          unknownColor="#fff"
          projectionType="mercator"
          projectionScale={config.projectionScale}
          projectionTranslation={config.projectionTranslation}
          projectionRotation={[-114, 0, 0]}
          borderWidth={config.borderWidth}
          borderColor={config.borderColor}
          tooltip={({ feature: { data } }) => {
            return data?.id ? (
              <div className="nivo-tooltip">
                {data.id}:{" "}
                {data.value === -1 ? (
                  t("common.no_data")
                ) : data.value_real ? (
                  <>
                    {numFormat(data.value_real, "standard")} {unitY}
                  </>
                ) : (
                  <>
                    {numFormat(data.value, "standard")}
                    {unitY}
                  </>
                )}
              </div>
            ) : (
              <></>
            );
          }}
        />
      </div>
      {enableZoom && (
        <div className="absolute right-1 top-1 z-10 flex w-fit justify-end gap-2">
          <button className="rounded border bg-white p-1 active:bg-outline" onClick={onReset}>
            <ArrowPathIcon className="h-4 w-4 p-0.5" />
          </button>
          <div>
            <button
              className="rounded rounded-r-none border bg-white p-1 active:bg-outline"
              onClick={zoomIn}
            >
              <PlusSmallIcon className="h-4 w-4" />
            </button>
            <button
              className="rounded rounded-l-none border border-l-0 bg-white p-1 active:bg-outline"
              onClick={zoomOut}
            >
              <MinusSmallIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* {enableScale && <ChoroplethScale colors={colorScale}></ChoroplethScale>} */}
    </div>
  );
};
/**
 * Choropleth Scale Component
 */
interface ChoroplethScaleProps {
  colors: string[];
}
const ChoroplethScale: FunctionComponent<ChoroplethScaleProps> = ({ colors }) => {
  const [min, max] = [colors[0], colors[colors.length - 1]];

  return (
    <div>
      <div
        className="h-3 w-full border border-black lg:ml-auto lg:max-w-[280px]"
        style={{ backgroundImage: `linear-gradient(to right, ${min}, ${max})` }}
      ></div>
      <div className="flex w-full justify-between lg:ml-auto lg:max-w-[280px]">
        <small>Minimum</small>
        <small>Maximum</small>
      </div>
    </div>
  );
};

const dummyData = [
  {
    id: "MYS",
    value: 416502,
  },
];

export default Choropleth;

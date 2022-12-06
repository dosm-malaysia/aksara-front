import { FunctionComponent } from "react";
import { useTranslation } from "next-i18next";
import { sequentialColorSchemes } from "@nivo/colors";
import type { ChoroplethColors } from "@lib/types";

/**
 * Choropleth Scale Component
 */
interface ChoroplethScaleProps {
  colors: ChoroplethColors;
}
const ChoroplethScale: FunctionComponent<ChoroplethScaleProps> = ({ colors }) => {
  const { t } = useTranslation();
  const color: string[] = Object.assign(
    [],
    sequentialColorSchemes[colors][sequentialColorSchemes[colors].length - 1]
  );
  const [min, max] = [color[0], color[color.length - 1]];

  return (
    <div className="absolute bottom-1 right-1 w-full lg:ml-auto lg:w-[280px]">
      <div
        className="h-3 w-full border border-black"
        style={{ backgroundImage: `linear-gradient(to right, ${min}, ${max})` }}
      />
      <div className="flex w-full justify-between">
        <small>{t("common.minimum")}</small>
        <small>{t("common.maximum")}</small>
      </div>
    </div>
  );
};

export default ChoroplethScale;

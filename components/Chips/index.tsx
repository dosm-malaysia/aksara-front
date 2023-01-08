import Button from "@components/Button";
import { OptionType } from "@components/types";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "next-i18next";
import { FunctionComponent } from "react";

interface ChipsProps {
  className?: string;
  data: OptionType[];
  onRemove: (value: string) => void;
  onClearAll?: () => void;
}

const Chips: FunctionComponent<ChipsProps> = ({ className, data, onRemove, onClearAll }) => {
  const { t } = useTranslation();
  return (
    <div className={["flex flex-wrap gap-2", className].join(" ")}>
      {data.map((item: OptionType) => {
        return (
          <Button
            key={item.value}
            className="border bg-washed py-1 px-2 text-sm font-medium leading-6"
            icon={<XMarkIcon className="h-4 w-4" onClick={() => onRemove(item.value)} />}
          >
            <>{item.label}</>
          </Button>
        );
      })}
      {onClearAll && data.length ? (
        <Button icon={<XMarkIcon className="h-4 w-4" />} onClick={onClearAll}>
          {t("common.clear_all")}
        </Button>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Chips;

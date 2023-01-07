import Button from "@components/Button";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "next-i18next";
import { FunctionComponent } from "react";

interface ChipsProps {
  className?: string;
  data: string[];
  onRemove: (value: string) => void;
  onClearAll?: () => void;
}

const Chips: FunctionComponent<ChipsProps> = ({ className, data, onRemove, onClearAll }) => {
  const { t } = useTranslation();
  return (
    <div className={["flex flex-wrap gap-2", className].join(" ")}>
      {data.map((item: string, index: number) => {
        return (
          <Button
            key={index}
            className="border bg-washed py-1 px-2 text-sm font-medium leading-6"
            icon={<XMarkIcon className="h-4 w-4" onClick={() => onRemove(item)} />}
          >
            <>{item}</>
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

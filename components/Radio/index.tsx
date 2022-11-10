import { FunctionComponent } from "react";
import Label, { LabelProps } from "@components/Label";
import { OptionType } from "@components/types";

interface RadioProps extends LabelProps {
  className?: string;
  name: string;
  options: OptionType[];
  value: OptionType;
  disabled?: boolean;
}

const Radio: FunctionComponent<RadioProps> = ({
  label,
  name,
  options,
  value,
  className = "space-y-1 pt-2",
}) => {
  return (
    <div>
      <Label label={label} />

      <ul className={className}>
        {options.map((option: OptionType) => (
          <li>
            <label htmlFor={option.value} className="flex items-center gap-2">
              <input id={option.value} value={option.value} type="radio" name={name} />
              <span className="block text-sm">{option.label}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Radio;

import Label, { LabelProps } from "@components/Label";
import { FunctionComponent, HTMLInputTypeAttribute, ReactElement } from "react";

interface InputProps extends LabelProps {
  className?: string;
  type?: Omit<HTMLInputTypeAttribute, "radio" | "checkbox">;
  placeholder?: string;
  icon?: ReactElement;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
}

const Input: FunctionComponent<InputProps> = ({
  name,
  label,
  className = "relative flex w-full items-center rounded-md border-0 outline-none text-sm md:text-base px-4 text-left appearance-none focus:outline-none focus:ring-0",
  type = "text",
  value,
  placeholder,
  icon,
  required = false,
  onChange,
}) => {
  return (
    <div className="w-full space-y-2">
      {label && <Label name={name} label={label} />}
      <div className="relative flex w-full flex-grow items-center gap-1">
        <div className="absolute left-3 text-dim">{icon && icon}</div>
        <input
          id={name}
          type={type as string}
          className={className}
          placeholder={placeholder}
          value={value}
          required={required}
          autoComplete="on"
          onChange={e => onChange && onChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Input;

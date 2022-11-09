import { FunctionComponent, HTMLInputTypeAttribute, ReactElement } from "react";

interface InputProps {
  className?: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  icon?: ReactElement;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
}

const Input: FunctionComponent<InputProps> = ({
  className = "relative flex w-full items-center rounded-md border-0 outline-none pl-3 pr-8 text-left appearance-none focus:outline-none focus:ring-0",
  type = "text",
  value,
  placeholder,
  icon,
  required = false,
  onChange,
}) => {
  return (
    <>
      <div className="relative flex w-full gap-2">
        {icon && icon}
        <input
          type={type}
          className={className}
          placeholder={placeholder}
          value={value}
          required={required}
          autoComplete="on"
          onChange={e => onChange && onChange(e.target.value)}
        />
      </div>
    </>
  );
};

export default Input;

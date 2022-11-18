import Image from "next/image";
import { Fragment, ReactElement, ReactNode } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import { isObjInArr } from "lib/helpers";

import { OptionType } from "@components/types";
import Label, { LabelProps } from "@components/Label";
import { XMarkIcon } from "@heroicons/react/24/solid";

type CommonProps<L, V> = {
  className?: string;
  disabled?: boolean;
  options: OptionType<L, V>[];
  description?: string;
  width?: string;
  enableFlag?: boolean | string;
  label?: string;
  sublabel?: ReactNode;
  darkMode?: boolean;
  anchor?: "left" | "right";
};

type ConditionalProps<L, V> =
  | {
      multiple?: true;
      selected?: any[];
      title: string;
      placeholder?: never;
      onChange: (selected: any[]) => void;
    }
  | {
      multiple?: false;
      selected?: any;
      title?: never;
      placeholder?: string;
      onChange: (selected: any) => void;
    };

type DropdownProps<L, V> = CommonProps<L, V> & ConditionalProps<L, V> & LabelProps;

const Dropdown = <L extends string | number | ReactElement = string, V = string>({
  className = "relative flex w-full items-center gap-[6px] rounded-md border py-[6px] pl-3 pr-8 text-left shadow-sm",
  disabled = false,
  multiple = false,
  options,
  selected,
  onChange,
  title,
  description,
  anchor = "right",
  placeholder,
  width = "w-fit",
  enableFlag = false,
  label,
  sublabel,
  darkMode = false,
}: DropdownProps<L, V>) => {
  const isSelected = (option: OptionType<L, V>): boolean => {
    return (
      multiple &&
      option &&
      (selected as OptionType<L, V>[]).some((item: OptionType<L, V>) => item.value === option.value)
    );
  };

  const handleDeselect = (option: OptionType<L, V>): any => {
    return (selected as OptionType<L, V>[]).filter(
      (item: OptionType<L, V>) => item.value !== option.value
    );
  };
  const handleChange = (options: any) => {
    if (!multiple) return onChange(options);

    const added = options;
    if (!isSelected(added)) {
      selected ? onChange([...selected, options]) : onChange([options]);
    } else {
      onChange(handleDeselect(added));
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label label={label}></Label>}
      <Listbox
        value={selected}
        onChange={(option: OptionType<L, V> & OptionType<L, V>[]) =>
          !multiple && handleChange(option)
        }
        multiple={multiple}
        disabled={disabled}
      >
        <div className={`relative text-sm ${disabled ? "cursor-not-allowed" : ""}`}>
          <Listbox.Button
            className={[
              ...[className, width],
              ...[
                darkMode
                  ? "border-outline/10 active:bg-washed/10"
                  : "border-outline bg-white active:bg-washed",
              ],
              ...[
                disabled
                  ? "pointer-events-none bg-outline text-dim"
                  : "hover:border-outlineHover focus:outline-none focus-visible:ring-0",
              ],
            ].join(" ")}
          >
            <>
              {sublabel && <span className="text-dim">{sublabel}</span>}
              {enableFlag && selected && (
                <Image
                  src={`/static/images/states/${
                    selected.code ?? (selected as OptionType<L, V>).value
                  }.jpeg`}
                  width={20}
                  height={12}
                  alt={(selected as OptionType<L, V>).label as string}
                />
              )}
              <span className={`block truncate ${label ? "" : ""}`}>
                {multiple
                  ? title
                  : (selected as OptionType<L, V>)?.label || placeholder || "Select"}
              </span>
              {/* NUMBER OF OPTIONS SELECTED (MULTIPLE = TRUE) */}
              {multiple && (selected as OptionType<L, V>[])?.length > 0 && (
                <span className="rounded-md bg-black px-1 py-0.5 text-xs text-white">
                  {selected && (selected as OptionType<L, V>[]).length}
                </span>
              )}
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1.5">
                <ChevronDownIcon className="h-5 w-5 text-dim" aria-hidden="true" />
              </span>
            </>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className={[
                ...[
                  "absolute z-10 mt-1 max-h-60 min-w-full overflow-auto rounded-md py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
                ],
                ...[anchor === "right" ? "right-0" : "left-0"],
                ...[darkMode ? "border border-outline/10 bg-black" : "bg-white"],
              ].join(" ")}
            >
              {/* DESCRIPTION */}
              {description && <p className="py-1 px-4 text-xs text-dim">{description}</p>}
              {/* OPTIONS */}
              {options.map((option, index) => (
                <Listbox.Option
                  key={index}
                  className={({ active }) =>
                    [
                      ...["relative flex cursor-default select-none items-center gap-2 py-2 pr-4"],
                      ...[multiple ? "pl-10" : "pl-4"],
                      ...[darkMode ? "hover:bg-washed/10" : "hover:bg-washed"],
                    ].join(" ")
                  }
                  onClick={() => (multiple ? handleChange(option) : null)}
                  value={option}
                >
                  {enableFlag && (
                    <Image
                      src={`/static/images/states/${option.code ?? option.value}.jpeg`}
                      width={20}
                      height={12}
                      alt={option.label as string}
                    />
                  )}
                  <span
                    className={`block truncate ${
                      option === selected ? "font-medium" : "font-normal"
                    }`}
                  >
                    {option.label}
                  </span>
                  {multiple && (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <input
                        type="checkbox"
                        checked={selected && isObjInArr(selected as OptionType<L, V>[], option)}
                        className="h-4 w-4 rounded border-outline text-dim focus:ring-0"
                      />
                    </span>
                  )}
                </Listbox.Option>
              ))}
              {/* CLEAR ALL (MULTIPLE = TRUE) */}
              {multiple && (
                <button
                  onClick={() => onChange([])}
                  className="group relative flex w-full cursor-default select-none items-center gap-2 py-2 pr-4 pl-10 text-dim hover:bg-washed disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={selected.length === 0}
                >
                  <p>Clear</p>
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <XMarkIcon className="h-5 w-5" />
                  </span>
                </button>
              )}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default Dropdown;

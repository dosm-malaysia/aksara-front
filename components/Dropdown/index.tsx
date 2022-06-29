import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon, XIcon } from "@heroicons/react/solid";

import { isObjInArr } from "lib/helpers";

import { OptionType } from "@components/types";

type CommonProps<T> = {
  disabled?: boolean;
  multiple?: boolean;
  options: OptionType<T>[];
  description?: string;
};

type ConditionalProps<T> =
  | {
      multiple?: true;
      selected?: OptionType<T>[];
      title: string;
      placeholder?: never;
      setSelected: (selected: OptionType<T>) => void;
      clearSelected: () => void;
    }
  | {
      multiple?: false;
      selected?: OptionType<T>;
      title?: never;
      placeholder?: string;
      setSelected: React.Dispatch<React.SetStateAction<OptionType<T>>>;
      clearSelected?: never;
    };

type DropdownProps<T> = CommonProps<T> & ConditionalProps<T>;

const Dropdown = <T extends string | number = string>({
  disabled = false,
  multiple = false,
  options,
  selected,
  setSelected,
  clearSelected,
  title,
  description,
  placeholder,
}: DropdownProps<T>) => {
  return (
    <Listbox
      value={selected}
      onChange={(option: OptionType<T>) =>
        multiple ? null : setSelected(option)
      }
      multiple={multiple}
      disabled={disabled}
    >
      <div
        className={`relative text-sm ${disabled ? "cursor-not-allowed" : ""}`}
      >
        <Listbox.Button
          className={`
            relative flex w-full items-center gap-[6px] rounded-md border border-outline bg-white py-[6px] pl-3 pr-8 text-left shadow-sm 
            ${
              disabled
                ? "pointer-events-none bg-outline text-dim"
                : "hover:border-outlineHover focus:bg-washed focus:outline-none focus-visible:ring-0"
            }
          `}
        >
          <span className="block truncate">
            {multiple
              ? title
              : (selected as OptionType<T>)?.label || placeholder || "Select"}
          </span>
          {/* NUMBER OF OPTIONS SELECTED (MULTIPLE = TRUE) */}
          {multiple && (selected as OptionType<T>[])?.length > 0 && (
            <span className="rounded-md bg-dim px-1 py-0.5 text-xs text-white">
              {(selected as OptionType<T>[]).length}
            </span>
          )}
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1.5">
            <ChevronDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute right-0 mt-1 max-h-60 w-40 overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {/* DESCRIPTION */}
            {description && (
              <p className="py-1 px-4 text-xs text-dim">{description}</p>
            )}
            {/* OPTIONS */}
            {options.map((option, index) => (
              <Listbox.Option
                key={index}
                className={({ active }) => `
                  relative flex cursor-default select-none items-center gap-2 py-2 pr-4
                  ${multiple ? "pl-10" : "pl-4"}
                  ${active ? "bg-washed" : ""}
                `}
                onClick={() => (multiple ? setSelected(option) : null)}
                value={option}
              >
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
                      checked={isObjInArr(selected as OptionType<T>[], option)}
                      className="h-4 w-4 rounded border-gray-300 text-dim focus:ring-0"
                    />
                  </span>
                )}
              </Listbox.Option>
            ))}
            {/* CLEAR ALL (MULTIPLE = TRUE) */}
            {multiple && (
              <li
                onClick={clearSelected}
                className="group relative flex cursor-default select-none items-center gap-2 py-2 pr-4 pl-10 text-dim hover:bg-washed"
              >
                <p>Clear</p>
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <XIcon className="h-5 w-5" />
                </span>
              </li>
            )}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default Dropdown;

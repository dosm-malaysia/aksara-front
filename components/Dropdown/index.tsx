import { Fragment, FunctionComponent } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";

import { isObjInArr } from "lib/helpers";

import { OptionType } from "@components/types";

type CommonProps = {
  multiple?: boolean;
  options: OptionType[];
  setSelected: (selected: OptionType) => void;
};

type ConditionalProps =
  | {
      multiple?: true;
      selected?: OptionType[];
      title: string;
      placeholder?: never;
    }
  | {
      multiple?: false;
      selected?: OptionType;
      title?: never;
      placeholder?: string;
    };

type DropdownProps = CommonProps & ConditionalProps;

const Dropdown: FunctionComponent<DropdownProps> = ({
  multiple = false,
  options,
  selected,
  setSelected,
  title,
  placeholder,
}) => {
  return (
    <Listbox
      value={selected}
      onChange={(option: OptionType) => (multiple ? null : setSelected(option))}
      multiple={multiple}
    >
      <div className="relative mt-1 text-sm">
        <Listbox.Button className="relative flex w-full items-center gap-[6px] rounded-md border border-outline bg-white py-[6px] pl-3 pr-8 text-left shadow-md focus:outline-none focus-visible:ring-0">
          <span className="block truncate">
            {multiple
              ? title
              : (selected as OptionType)?.label || placeholder || "Select"}
          </span>
          {/* NUMBER OF OPTIONS SELECTED (MULTIPLE = TRUE) */}
          {multiple && (selected as OptionType[])?.length > 0 && (
            <span className="rounded-md bg-dim px-1 py-0.5 text-xs text-white">
              {(selected as OptionType[]).length}
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
            {options.map((option, index) => (
              <Listbox.Option
                key={index}
                className={({ active }) => `
                    relative flex cursor-default select-none items-center gap-2 py-2 pl-10 pr-4
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
                      checked={isObjInArr(selected as OptionType[], option)}
                      className="h-4 w-4 rounded border-gray-300 text-dim focus:ring-0"
                    />
                  </span>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default Dropdown;

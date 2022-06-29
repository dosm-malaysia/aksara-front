import { useState } from "react";
import type { NextPage } from "next";

import {
  intervalOptions,
  geographyOptions,
  dataStartOptions,
  dataEndOptions,
  dataSourceOptions,
} from "@lib/options";
import { handleSelectMultipleDropdown } from "@lib/helpers";

import { OptionType } from "@components/types";

import Hero from "@components/Hero";
import Dropdown from "@components/Dropdown";
import Container from "@components/Container";

const Catalogue: NextPage = () => {
  const [interval, setInterval] = useState({
    label: intervalOptions[0],
    value: intervalOptions[0],
  });

  const [geography, setGeography] = useState([
    {
      label: geographyOptions[0],
      value: geographyOptions[0],
    },
  ]);

  const [dataStart, setDataStart] = useState<OptionType<number>>({
    label: dataStartOptions[0],
    value: dataStartOptions[0],
  });

  const [dataEnd, setDataEnd] = useState<OptionType<number>>({
    label: dataEndOptions[0],
    value: dataEndOptions[0],
  });

  const [dataSource, setDataSource] = useState([
    {
      label: dataSourceOptions[0],
      value: dataSourceOptions[0],
    },
  ]);

  return (
    <>
      <Hero background="hero-light-1">
        <h3 className="mb-2">Data Catalogue</h3>
        <p className="max-w-3xl text-dim">
          Your one-stop interface to browse Malaysia's wealth of open data. This
          page documents not just the data used on AKSARA, but all open data
          from all Malaysian government agencies.
        </p>
      </Hero>
      <Container className="min-h-screen">
        <div className="flex items-center justify-end gap-2 py-2">
          <Dropdown
            selected={interval}
            setSelected={setInterval}
            options={intervalOptions.map(option => ({
              label: option,
              value: option,
            }))}
          />
          <Dropdown
            multiple={true}
            title="Geography"
            selected={geography}
            setSelected={(option: OptionType) =>
              handleSelectMultipleDropdown(option, geography, setGeography)
            }
            clearSelected={() => setGeography([])}
            options={geographyOptions.map(option => ({
              label: option,
              value: option,
            }))}
          />
          <Dropdown<number>
            description="Dataset begins from"
            selected={dataStart}
            setSelected={setDataStart}
            options={dataStartOptions.map(option => ({
              label: option,
              value: option,
            }))}
          />
          <Dropdown<number>
            description="Most recent datapoint"
            selected={dataEnd}
            setSelected={setDataEnd}
            options={dataEndOptions.map(option => ({
              label: option,
              value: option,
            }))}
          />
          <Dropdown
            multiple={true}
            title="Data source"
            selected={dataSource}
            setSelected={(option: OptionType) =>
              handleSelectMultipleDropdown(option, dataSource, setDataSource)
            }
            clearSelected={() => setDataSource([])}
            options={dataSourceOptions.map(option => ({
              label: option,
              value: option,
            }))}
          />
        </div>
      </Container>
    </>
  );
};

export default Catalogue;

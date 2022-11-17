import { OptionType } from "@components/types";
import debounce from "lodash/debounce";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { useData } from "./useData";
import { useWatch } from "./useWatch";

export const useFilter = (state: Record<string, any> = {}, params = {}) => {
  const { data, setData } = useData(state);
  const router = useRouter();

  const actives: Array<[string, unknown]> = useMemo(
    () =>
      Object.entries(data).filter(
        ([_, value]) =>
          value !== undefined &&
          value !== null &&
          (value as Array<any>).length !== 0 &&
          value !== ""
      ),
    [data]
  );

  const queries: string = useMemo(() => {
    const query = actives
      .map(([key, value]) =>
        Array.isArray(value)
          ? `${key}=${value.map((item: OptionType) => item.value).join(",")}`
          : `${key}=${(value as OptionType).value ?? value}`
      )
      .join("&");
    return `?${query}`;
  }, [data]);

  const search = useCallback(
    debounce(() => {
      const query = actives.map(([key, value]: [string, unknown]) => [
        key,
        (value as OptionType).value,
      ]);

      router.replace({
        pathname: router.pathname,
        query: {
          ...params,
          ...Object.fromEntries(query),
        },
      });
    }),
    [data]
  );

  useWatch(() => {
    search();
  }, [data]);

  return {
    filter: data,
    setFilter: setData,
    queries,
  };
};

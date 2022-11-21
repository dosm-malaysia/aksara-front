import { useCallback } from "react";

export const useSlice = (
  state: Record<string, number[]>,
  minmax?: [number, number],
  callback?: (data: Record<string, number[]>) => Record<string, number[]> | undefined
) => {
  const slice = () => {
    if (callback !== undefined) return callback(state);
    const sliced = Object.entries(state).map(([key, data]) => [
      key,
      data.slice(minmax ? minmax[0] : 0, minmax ? minmax[1] + 1 : data.length - 1),
    ]);
    return Object.fromEntries(sliced);
  };

  return {
    coordinate: useCallback(slice, [minmax, state]),
  };
};

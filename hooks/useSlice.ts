import { useCallback } from "react";

export const useSlice = (state: Record<string, number[]>, minmax?: [number, number]) => {
  const slice = () => {
    const sliced = Object.entries(state).map(([key, data]) => [
      key,
      data.slice(minmax ? minmax[0] : 0, minmax ? minmax[1] + 1 : data.length - 1),
    ]);
    return Object.fromEntries(sliced);
  };

  return {
    coordinate: useCallback<() => typeof state>(slice, [minmax, state])(),
  } as const;
};

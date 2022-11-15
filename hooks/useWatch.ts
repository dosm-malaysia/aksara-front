import { useEffect, useRef } from "react";

/**
 * Alternative to useEffect.
 * @param {Function} fn Callback function
 * @param {Array} deps useEffect deps
 * @param {boolean} [runOnMount=false] Runs on initial render
 * @returns
 */
export const useWatch = (fn: Function, deps: Array<any> = [], runOnMount: boolean = false) => {
  const firstRender = useRef(true);

  return useEffect(() => {
    if (!runOnMount && firstRender.current) {
      firstRender.current = false;
      return;
    }
    fn();
  }, deps);
};

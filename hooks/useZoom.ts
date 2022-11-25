import { MutableRefObject, useState, useEffect, WheelEvent, MouseEvent, useMemo } from "react";

type Viewbox = {
  x: number;
  y: number;
  w: number;
  h: number;
  scale: number;
};

export const useZoom = (ref: MutableRefObject<null | Document>) => {
  const [svg, setSvg] = useState<SVGSVGElement | undefined>();
  const [original, setOriginal] = useState<Pick<Viewbox, "w" | "h">>({ w: 0, h: 0 });
  const [pan, setPanning] = useState<boolean>(false);
  const [data, setData] = useState<Viewbox>({
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    scale: 1,
  });

  useEffect(() => {
    if (ref.current && ref.current !== null) {
      const svg = ref.current.querySelector("svg");
      if (svg !== null) {
        ref.current?.addEventListener("wheel", e => e.preventDefault());
        const rect = svg.getBoundingClientRect();
        setSvg(svg);
        setOriginal({
          w: rect.width,
          h: rect.height,
        });
        setData({
          x: 0,
          y: 0,
          w: rect.width,
          h: rect.height,
          scale: 1,
        });
      }
    }
  }, [ref.current]);

  const viewbox = useMemo(() => {
    const view = { x: data.x, y: data.y, w: data.w, h: data.h };
    return Object.values(view).join(" ");
  }, [data]);

  const onWheel = (e: WheelEvent<HTMLDivElement>) => {
    let w = data.w;
    let h = data.h;
    let mx = e.clientX; //mouse x
    let my = e.clientY;
    let dw = w * Math.sign(e.deltaY) * 0.05;
    let dh = h * Math.sign(e.deltaY) * 0.05;
    let dx = (dw * mx) / original.w;
    let dy = (dh * my) / original.h;
    let scale = original.w / data.w;
    setData({
      x: data.x + dx,
      y: data.y + dy,
      w: data.w - dw,
      h: data.h - dh,
      scale: scale,
    });

    if (ref.current) {
      svg?.setAttribute("viewBox", `${data.x} ${data.y} ${data.w} ${data.h}`);
    }
  };

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (pan) {
      setData(state => ({
        ...state,
        x: state.x - e.movementX,
        y: state.y - e.movementY,
      }));

      svg?.setAttribute("viewBox", viewbox);
    }
  };

  const onDown = (e: MouseEvent<HTMLDivElement>) => {
    setPanning(true);
  };
  const onUp = (e: MouseEvent<HTMLDivElement>) => {
    setPanning(false);
  };

  return {
    onWheel,
    onMove,
    onDown,
    onUp,
  };
};

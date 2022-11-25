import {
  MutableRefObject,
  useState,
  useEffect,
  WheelEvent,
  MouseEvent,
  TouchEvent,
  useMemo,
} from "react";

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
  const [prevTouch, setPrevTouch] = useState<Touch>();
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
        ref.current?.addEventListener("touchmove", e => e.preventDefault());
        ref.current?.addEventListener("scroll", e => e.preventDefault());
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

  const onWheel = (e: WheelEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => {
    if (!isTouchEvent(e)) {
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
    }

    if (ref.current) {
      svg?.setAttribute("viewBox", `${data.x} ${data.y} ${data.w} ${data.h}`);
    }
  };

  const onMove = (e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => {
    if (pan && !isTouchEvent(e)) {
      setData(state => ({
        ...state,
        x: state.x - e.movementX,
        y: state.y - e.movementY,
      }));
    } else if (pan && isTouchEvent(e)) {
      const touch = (e as TouchEvent).touches[0];

      if (prevTouch) {
        setData(state => ({
          ...state,
          x: state.x - (touch.clientX - prevTouch.clientX),
          y: state.y - (touch.clientY - prevTouch.clientY),
        }));
      }

      setPrevTouch(touch as Touch);
    }
    svg?.setAttribute("viewBox", viewbox);
  };

  const onDown = (e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => {
    setPanning(true);
  };
  const onUp = (e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => {
    setPanning(false);
    setPrevTouch(undefined);
  };

  function isTouchEvent(
    event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement> | WheelEvent<HTMLDivElement>
  ): event is TouchEvent<HTMLDivElement> {
    return (event as TouchEvent).touches !== undefined;
  }

  return {
    onWheel,
    onMove,
    onDown,
    onUp,
  };
};

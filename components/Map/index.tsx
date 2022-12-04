import { useRef, useEffect } from "react";

import { BREAKPOINTS } from "@lib/constants";
import { useWindowWidth } from "@hooks/useWindowWidth";

interface MapProps extends google.maps.MapOptions {
  geojson: any;
}

const Map: React.FC<MapProps> = ({ geojson }) => {
  const ref = useRef<HTMLDivElement>(null);

  const width = useWindowWidth();

  useEffect(() => {
    if (ref.current) {
      const map = new google.maps.Map(ref.current, {
        zoom: 0,
        disableDefaultUI: true,
      });

      // LOAD GEOJSON
      map.data.addGeoJson(geojson);

      // SET GEOJSON STYLE
      map.data.setStyle({
        fillColor: "#ffffff",
        fillOpacity: 0.25,
        strokeColor: "#13293d",
        strokeWeight: 1,
      });

      // FIT MAP TO GEOJSON BOUNDS
      let bounds = new google.maps.LatLngBounds();
      map.data.forEach(feature => {
        feature.getGeometry()?.forEachLatLng(latLng => {
          // -20 only for /geo/area=mys to fit both peninsulas
          bounds?.extend(new google.maps.LatLng(latLng.lat(), latLng.lng() - 30));
        });
      });

      // 60 padding only for /geo/area=mys to fit both peninsula, s&s
      // controls zoom
      map.fitBounds(bounds, 60);
    }
  }, [geojson]);

  return (
    <div
      //   style={{ ...(width < BREAKPOINTS.LG && height && { height: height }) }}
      className="absolute top-0 left-0 -z-10 flex w-full lg:h-full"
      ref={ref}
    />
  );
};

export default Map;

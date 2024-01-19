import React, { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L, { LatLng } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap} from "react-leaflet";

const icon = L.icon({
  iconUrl: "./placeholder.png",
  iconSize: [38, 38],
});

interface ResetCenterViewProps {
  selectPosition: { lat: number; lon: number } | null;
}

function ResetCenterView(props: ResetCenterViewProps) {
  const { selectPosition } = props;
  const map = useMap();

  useEffect(() => {
    if (selectPosition) {
      const { lat, lon } = selectPosition;
      map.setView(L.latLng(lat, lon), map.getZoom(), {
        animate: true,
      });
    }
  }, [selectPosition, map]);

  return null;
}

interface MapsProps {
  selectPosition: { lat: number; lon: number } | null;
}

export default function Maps(props: MapsProps) {
  const { selectPosition } = props;
  const locationSelection: LatLng | undefined = selectPosition
    ? L.latLng(selectPosition.lat, selectPosition.lon)
    : undefined;

  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={8}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        url="https://api.maptiler.com/maps/basic/256/{z}/{x}/{y}.png?key=TB5uV6OzQzJvldZSKnfG"
      />
      {selectPosition && locationSelection && (
        <Marker position={locationSelection} icon={icon}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      )}
      <ResetCenterView selectPosition={selectPosition} />
    </MapContainer>
  );
}

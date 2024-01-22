import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L, { LatLng } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { Box, Button, Divider, IconButton, InputBase, List, ListItem, ListItemIcon, ListItemText, OutlinedInput, Paper, TextField } from "@mui/material";
import { debounce } from "lodash";
import SvgIconStyle from "./SvgIconStyle";
import Control from "react-leaflet-custom-control";

const icon = L.icon({
  iconUrl: "/img/location.png",
  iconSize: [38, 38],
});

interface ResetCenterViewProps {
  selectPosition: { lat: number; lon: number } | null;
}

function ResetCenterView(props: ResetCenterViewProps) {
  const { selectPosition } = props;
  const map = useMap();
  map.zoomControl.setPosition('bottomright')
  useEffect(() => {
    if (selectPosition?.lat&& selectPosition?.lon) {
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
  setSelectPosition: (position: { lat: number; lon: number } | null) => void;
}
interface LocationFinderDummyProp {
  setSelectPosition: (position: { lat: number; lon: number } | null) => void;
}
const LocationFinderDummy = ({ setSelectPosition }: LocationFinderDummyProp) => {
  const map = useMapEvents({
    click(e) {
      setSelectPosition({
        lat: Number(e.latlng.lat),
        lon: Number(e.latlng.lng),
      });
    },
  });
  return null;
};
export default function Maps(props: MapsProps) {
  const { selectPosition, setSelectPosition } = props;
  const locationSelection: LatLng | undefined = selectPosition
    ? L.latLng(selectPosition.lat, selectPosition.lon)
    : undefined;

  const handleCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setSelectPosition({
        lat: Number(position.coords.latitude),
        lon: Number(position.coords.longitude),
      });
    })

  };

  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={8}
      style={{ width: "100%", height: '300px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

      />
      {selectPosition && locationSelection && (
        <Marker position={locationSelection} icon={icon}>
          {/* <Popup>
          </Popup> */}
        </Marker>
      )}
      <Control position="topleft">
        <SearchBox selectPosition={selectPosition} setSelectPosition={setSelectPosition}></SearchBox>
      </Control>
      <LocationFinderDummy setSelectPosition={setSelectPosition}></LocationFinderDummy>
      <Control position="bottomleft">

        <IconButton onClick={handleCurrentLocation} sx={{ color: '#0C68F4', p: '10px' }} type="button" aria-label="current location">
          <SvgIconStyle src={'/icons/ic_gps.svg'} />
        </IconButton>

      </Control>
      <ResetCenterView selectPosition={selectPosition} />
    </MapContainer>
  );
}



const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";
const params = {
  q: "",
  format: "json",
  addressdetails: "addressdetails",
};



interface Place {
  place_id?: string;
  display_name?: string;
  lat?: string;
  lon?: string;
  // Add other properties as needed
}

export function SearchBox(props: MapsProps) {
  const { selectPosition, setSelectPosition } = props;
  const [searchText, setSearchText] = useState("");
  const [listPlace, setListPlace] = useState<Place[]>([]);
  const handleListItemClick = (item: Place) => {
    console.log(item)
    setSelectPosition({
      lat: Number(item.lat),
      lon: Number(item.lon),
    });
    setSearchText('')
    setListPlace([])
  };
  const debouncedSearch = debounce((query) => {
    const searchParams = {
      q: query,
      format: "json",
      addressdetails: "1",
      polygon_geojson: "0",
    };
    const queryString = new URLSearchParams(searchParams).toString();
    const requestOptions: RequestInit = {
      method: "GET",
      redirect: "follow",
    };
    fetch(`${NOMINATIM_BASE_URL}${queryString}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        const parsedResult: Place[] = result;
        setListPlace(parsedResult);
      })
      .catch((err) => console.log("err: ", err));
  }, 700);

  useEffect(() => {
    if (searchText.trim() !== '') {
      debouncedSearch(searchText);
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchText]);

  return (
    <div  >
      <Paper
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
      >
        <InputBase
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search Google Maps"
          inputProps={{ 'aria-label': 'search google maps' }}
        />

        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions">
          {/* <DirectionsIcon /> */}
        </IconButton>
      </Paper>

      <div>
        <List component="nav" aria-label="main mailbox folders" style={{ background: listPlace.length > 0 ? 'white' : 'none' }}>
          {listPlace.map((item) => {
            return (
              <div key={item?.place_id}>
                <ListItem
                  onClick={() => handleListItemClick(item)}

                >
                  <ListItemIcon>
                    <img
                      src='/img/location.png'
                      alt="Placeholder"
                      style={{ width: 38, height: 38 }}
                    />
                  </ListItemIcon>
                  <ListItemText primary={item?.display_name} />
                </ListItem>
                <Divider />
              </div>
            );
          })}
        </List>
      </div>
    </div>
  );
}
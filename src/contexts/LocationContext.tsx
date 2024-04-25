import { createContext, ReactNode, useEffect, useState } from 'react';
import { ActionMap } from 'src/@types/common';
import { LocationState } from 'src/@types/location';
import { LocationContextProps } from 'src/components/settings/type';
import { locationApi, areaResponse } from 'src/service/app-apis/location';

const locationStateInit = {
  provinces: [],
  districts: [],
  precincts: [],
  streetBlocks: [],
  province: undefined,
  district: undefined,
  precinct: undefined,
  streetBlock: undefined,
};
const emptyLocation: CurrentLocation = {
  place_id: 0,
  licence: '',
  osm_type: '',
  osm_id: 0,
  lat: '',
  lon: '',
  class: '',
  type: '',
  place_rank: 0,
  importance: 0,
  addresstype: '',
  name: '',
  display_name: '',
  ip: '',
  address: {
    road: '',
    quarter: '',
    suburb: '',
    city: '',
    ISO3166_2_lvl4: '',
    postcode: '',
    country: '',
    country_code: '',
  },
};
const initialState: LocationContextProps = {
  locationState: locationStateInit,
  currentLocation: emptyLocation,
  onSubmit: () => {},
  handleLocationSelect: () => {},
  initFromOld: (province: string, district: string, precinct: string, streetBlock: string) => {},
};
const LocationContext = createContext(initialState);

type LocationProviderProps = {
  children: ReactNode;
};
const initialLocation = async () => {
  const provinces = await locationApi.area(null);
  return {
    provinces: provinces,
  };
};

export interface locationObject {
  provinces: Array<areaResponse>;
  districts: Array<areaResponse>;
  precincts: Array<areaResponse>;
  streetBlocks: Array<areaResponse>;
  streetBlock: areaResponse | undefined;
  province: areaResponse | undefined;
  district: areaResponse | undefined;
  precinct: areaResponse | undefined;
}
export interface CurrentLocation {
  place_id: number;
  licence: string;
  osm_type: string;
  ip: string;
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  address: {
    road: string;
    quarter: string;
    suburb: string;
    city: string;
    ISO3166_2_lvl4: string;
    postcode: string;
    country: string;
    country_code: string;
  };
}

function LocationProvider({ children }: LocationProviderProps) {
  const [locationState, setLocationState] = useState<locationObject>(locationStateInit);
  const [currentLocation, setCurrentLocation] = useState<CurrentLocation>(emptyLocation);
  const { province, district, precinct, streetBlock } = locationState;
  const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/reverse?format=json&';
  const GEOLOCATION_URL = 'https://geolocation-db.com/json/';
  useEffect(() => {
    (() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetch(
              `${NOMINATIM_BASE_URL}lat=${position.coords.latitude}&lon=${position.coords.longitude}`
            )
              .then((response) => response.json())
              .then((result) => {
              console.log(result)
                setCurrentLocation(result);
              })
              .then(() =>  {
                fetch(GEOLOCATION_URL)
                  .then((response) => response.json())
                  .then((result) => {
                    setCurrentLocation((prevLocation) => ({
                      ...prevLocation,
                      ip: result.IPv4,
                    }));
                  })
                  .catch((err) => console.log('err: ', err));
              })
              .catch((err) => console.log('err: ', err));
          },
          (error) => {
            console.error('Error getting geolocation:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    })();
  }, []);
  useEffect(() => {
    (async () => {
      try {
        const initData = await initialLocation();
        setLocationState(locationStateInit);
        setLocationState({
          ...locationState,
          provinces: initData.provinces,
        });
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  useEffect(() => {
    (async () => {
      if (!province?.areaCode) return;
      const options = await locationApi.area(province.areaCode);
      setLocationState({ ...locationState, districts: options });
    })();
  }, [province]);
  useEffect(() => {
    (async () => {
      if (!district?.areaCode) return;
      const options = await locationApi.area(district.areaCode!);
      setLocationState({ ...locationState, precincts: options });
    })();
  }, [district]);
  useEffect(() => {
    (async () => {
      if (!precinct?.areaCode) return;
      const options = await locationApi.area(precinct.areaCode!);
      setLocationState({ ...locationState, streetBlocks: options });
    })();
  }, [precinct]);

  const handleLocationSelect = (option: areaResponse | undefined, selectedField: string) => {
    const updatedState: Partial<locationObject> = {
      [selectedField]: option,
    };
    if (selectedField === 'province') {
      updatedState.districts = [];
      updatedState.precincts = [];
      updatedState.streetBlocks = [];
    } else if (selectedField === 'district') {
      updatedState.precincts = [];
      updatedState.streetBlocks = [];
    } else if (selectedField === 'precinct') {
      updatedState.streetBlocks = [];
    }
    setLocationState({ ...locationState, ...updatedState });
  };
  const initFromOld = async (
    province: string,
    district: string,
    precinct: string,
    streetBlock: string
  ) => {
    const provinces = await locationApi.area(null);
    const provinceSelected = await provinces.find((item) => item.areaCode === province);
    const districts = await locationApi.area(province);
    const districtSelected = await districts.find((item) => item.areaCode === district);
    const precincts = await locationApi.area(district);
    const precintsSelected = await precincts.find((item) => item.areaCode === precinct);
    const streetBlocks = await locationApi.area(precinct);
    const streetBlockSelected = await streetBlocks.find((item) => item.areaCode === streetBlock);
    const newState = {
      province: provinceSelected,
      district: districtSelected,
      precinct: precintsSelected,
      streetBlock: streetBlockSelected,
      provinces: provinces,
      districts: districts,
      precincts: precincts,
      streetBlocks: streetBlocks,
    };
    setLocationState(newState);
  };

  const onSubmit = (e: Event) => {
    e.preventDefault();
    window.location.reload();
  };

  return (
    <LocationContext.Provider
      value={{
        locationState,
        currentLocation,
        onSubmit,
        handleLocationSelect,
        initFromOld,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}
export { LocationContext, LocationProvider };

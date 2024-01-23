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
const initialState: LocationContextProps = {
  locationState: locationStateInit,
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

function LocationProvider({ children }: LocationProviderProps) {
  const [locationState, setLocationState] = useState<locationObject>(locationStateInit);
  const { province, district, precinct, streetBlock } = locationState;

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

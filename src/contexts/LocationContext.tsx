import { createContext, ReactNode, useEffect, useState } from 'react';
import { ActionMap } from 'src/@types/common';
import { LocationState } from 'src/@types/location';
import { LocationContextProps } from 'src/components/settings/type';
import { locationApi, areaResponse } from 'src/service/app-apis/location';

const initialState: LocationContextProps = {
  locationState: {
    provinces: [],
    districts: [],
    precincts: [],
    streetBlocks: [],
    province: {
      id: null,
      name: null,
      createDatetime: null,
      updateDatetime: null,
      createUser: null,
      updateUser: null,
      status: null,
      areaCode: null,
      province: null,
      district: null,
      precinct: null,
      streetBlock: null,
      parentCode: null,
      fullName: null,
    },
    district: {
      id: null,
      name: null,
      createDatetime: null,
      updateDatetime: null,
      createUser: null,
      updateUser: null,
      status: null,
      areaCode: null,
      province: null,
      district: null,
      precinct: null,
      streetBlock: null,
      parentCode: null,
      fullName: null,
    },
    precinct: {
      id: null,
      name: null,
      createDatetime: null,
      updateDatetime: null,
      createUser: null,
      updateUser: null,
      status: null,
      areaCode: null,
      province: null,
      district: null,
      precinct: null,
      streetBlock: null,
      parentCode: null,
      fullName: null,
    },
    streetBlock: {
      id: null,
      name: null,
      createDatetime: null,
      updateDatetime: null,
      createUser: null,
      updateUser: null,
      status: null,
      areaCode: null,
      province: null,
      district: null,
      precinct: null,
      streetBlock: null,
      parentCode: null,
      fullName: null,
    },
  },
  onPrecinctSelect: () => {},
  onStreetBlockSelect: () => {},
  onProvinceSelect: () => {},
  onDistrictSelect: () => {},
  onSubmit: () => {},
};
const LocationContext = createContext(initialState);

type LocationProviderProps = {
  children: ReactNode;
};
const initialLocation = async () => {
  const provinces = await locationApi.area(null);
  //   const districts = await locationApi.districts(cityId);
  //   const wards = await locationApi.wards(districtId);
  return {
    provinces: provinces,
    // districtOptions: districts,
    // wardOptions: wards,
    // selectedCity: cities.find((c) => c.id === cityId),
    // selectedDistrict: districts.find((d) => d.id === districtId),
    // selectedWard: wards.find((w) => w.id === wardId),
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
  const [locationState, setLocationState] = useState<locationObject>({
    provinces: [],
    districts: [],
    precincts: [],
    streetBlocks: [],
    province: {
      id: null,
      name: null,
      createDatetime: null,
      updateDatetime: null,
      createUser: null,
      updateUser: null,
      status: null,
      areaCode: null,
      province: null,
      district: null,
      precinct: null,
      streetBlock: null,
      parentCode: null,
      fullName: null,
    },
    district: {
      id: null,
      name: null,
      createDatetime: null,
      updateDatetime: null,
      createUser: null,
      updateUser: null,
      status: null,
      areaCode: null,
      province: null,
      district: null,
      precinct: null,
      streetBlock: null,
      parentCode: null,
      fullName: null,
    },
    precinct: {
      id: null,
      name: null,
      createDatetime: null,
      updateDatetime: null,
      createUser: null,
      updateUser: null,
      status: null,
      areaCode: null,
      province: null,
      district: null,
      precinct: null,
      streetBlock: null,
      parentCode: null,
      fullName: null,
    },
    streetBlock: {
      id: null,
      name: null,
      createDatetime: null,
      updateDatetime: null,
      createUser: null,
      updateUser: null,
      status: null,
      areaCode: null,
      province: null,
      district: null,
      precinct: null,
      streetBlock: null,
      parentCode: null,
      fullName: null,
    },
  });
  const { province, district, precinct, streetBlock } = locationState;

  useEffect(() => {
    (async () => {
      console.log('effect1');
      try {
        const initData = await initialLocation();
        setLocationState({
          ...locationState,
          provinces: initData.provinces,
          // selectedCity:initData.selectedCity
        });
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  useEffect(() => {
    (async () => {
      console.log(province);
      if (!province?.areaCode) return;

      const options = await locationApi.area(province.areaCode);
      setLocationState({ ...locationState, districts: options });
    })();
  }, [province]);
  useEffect(() => {
    (async () => {
      console.log('effect');

      if (!district?.areaCode) return;
      const options = await locationApi.area(district.areaCode!);
      setLocationState({ ...locationState, precincts: options });
    })();
  }, [district]);
  useEffect(() => {
    (async () => {
      console.log('effect');
      if (!precinct?.areaCode) return;
      const options = await locationApi.area(precinct.areaCode!);
      setLocationState({ ...locationState, streetBlocks: options });
    })();
  }, [precinct]);


  const onProvinceSelect = (option: areaResponse) => {
    console.log(option);
    if (option !== province) {
      console.log(province);
      setLocationState({
        ...locationState,
        districts: [],
        precincts: [],
        streetBlocks: [],
        province: option,
        district: {
          id: null,
          name: null,
          createDatetime: null,
          updateDatetime: null,
          createUser: null,
          updateUser: null,
          status: null,
          areaCode: null,
          province: null,
          district: null,
          precinct: null,
          streetBlock: null,
          parentCode: null,
          fullName: null,
        },
        precinct: {
          id: null,
          name: null,
          createDatetime: null,
          updateDatetime: null,
          createUser: null,
          updateUser: null,
          status: null,
          areaCode: null,
          province: null,
          district: null,
          precinct: null,
          streetBlock: null,
          parentCode: null,
          fullName: null,
        },
        streetBlock: {
          id: null,
          name: null,
          createDatetime: null,
          updateDatetime: null,
          createUser: null,
          updateUser: null,
          status: null,
          areaCode: null,
          province: null,
          district: null,
          precinct: null,
          streetBlock: null,
          parentCode: null,
          fullName: null,
        },
      });
    }
  };

  const onDistrictSelect = (option: areaResponse) => {
    console.log('district select');
    if (option !== district) {
      setLocationState({
        ...locationState,
        precincts: [],
        streetBlocks: [],
        district: option,
        precinct: {
          id: null,
          name: null,
          createDatetime: null,
          updateDatetime: null,
          createUser: null,
          updateUser: null,
          status: null,
          areaCode: null,
          province: null,
          district: null,
          precinct: null,
          streetBlock: null,
          parentCode: null,
          fullName: null,
        },
        streetBlock: {
          id: null,
          name: null,
          createDatetime: null,
          updateDatetime: null,
          createUser: null,
          updateUser: null,
          status: null,
          areaCode: null,
          province: null,
          district: null,
          precinct: null,
          streetBlock: null,
          parentCode: null,
          fullName: null,
        },
      });
    }
  };

  const onPrecinctSelect = (option: areaResponse) => {
    if (option !== precinct) {
      setLocationState({
        ...locationState,
        precinct: option,
        streetBlock: {
          id: null,
          name: null,
          createDatetime: null,
          updateDatetime: null,
          createUser: null,
          updateUser: null,
          status: null,
          areaCode: null,
          province: null,
          district: null,
          precinct: null,
          streetBlock: null,
          parentCode: null,
          fullName: null,
        },
      });
    }
  };
  const onStreetBlockSelect = (option: areaResponse) => {
    if (option !== streetBlock) {
    setLocationState({
      ...locationState,
      streetBlock: option,
    });}
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
        onPrecinctSelect,
        onStreetBlockSelect,
        onProvinceSelect,
        onDistrictSelect,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}
export { LocationContext, LocationProvider };

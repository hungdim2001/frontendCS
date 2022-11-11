import { createContext, ReactNode, useEffect, useState } from "react";
import { ActionMap } from "src/@types/common";
import { LocationState } from "src/@types/location";
import { LocationContextProps } from "src/components/settings/type";
import { locationApi, responseDataLocation } from "src/service/app-apis/location";

const initialState: LocationContextProps = {
    locationState: {
        cityOptions: [],
        districtOptions: [],
        wardOptions: [],
        selectedCity: {
            id: null,
            name: null
        },
        selectedDistrict: {
            id: null,
            name: null
        },
        selectedWard: {
            id: null,
            name: null
        }
    },

    onSubmit: () => { },
    onWardSelect: () => { },
    onCitySelect: () => { },
    onDistrictSelect: () => { }
}
const LocationContext = createContext(initialState);

type LocationProviderProps = {
    children: ReactNode;
};
const initialLocation = async () => {

    const { cityId, districtId, wardId } = await locationApi.locations();
    const cities = await locationApi.citys();
    const districts = await locationApi.districts(cityId);
    const wards = await locationApi.wards(districtId);

    return {
        cityOptions: cities,
        districtOptions: districts,
        wardOptions: wards,
        selectedCity: cities.find((c) => c.id === cityId),
        selectedDistrict: districts.find((d) => d.id === districtId),
        selectedWard: wards.find((w) => w.id === wardId)
    }
}

export interface locationObject {
    cityOptions: Array<responseDataLocation>;
    districtOptions: Array<responseDataLocation>;
    wardOptions: Array<responseDataLocation>;
    selectedCity: responseDataLocation | undefined;
    selectedDistrict: responseDataLocation | undefined;
    selectedWard: responseDataLocation | undefined
}

function LocationProvider({ children }: LocationProviderProps) {

    const [locationState, setLocationState] = useState<locationObject>({
        cityOptions: [],
        districtOptions: [],
        wardOptions: [],
        selectedCity: {
            id: null,
            name: null
        },
        selectedDistrict: {
            id: null,
            name: null
        },
        selectedWard: {
            id: null,
            name: null
        }
    })
    const { selectedCity, selectedDistrict } = locationState;

    useEffect(() => {
        (async () => {

            try {
                const initData = await initialLocation();
                setLocationState({
                    ...locationState,
                    cityOptions:initData.cityOptions,
                    // selectedCity:initData.selectedCity
                })
            } catch (error) {
                console.log(error)
            }

        })()
    }
        , [])
    useEffect(() => {
        (async () => {
            if (!selectedCity?.id) return;
          
            const options = await locationApi.districts(selectedCity.id!)
            setLocationState({ ...locationState, districtOptions: options });
        })()
    }, [selectedCity])
    useEffect(() => {
        (async () => {
            if (!selectedDistrict?.id) return;
           
            const options = await locationApi.wards(selectedDistrict.id!)
            setLocationState({ ...locationState, wardOptions: options });
        })()
    }, [selectedDistrict])

    const onCitySelect = (option: responseDataLocation) => {
        if (option !== selectedCity) {
            setLocationState({
                ...locationState,
                districtOptions: [],
                wardOptions: [],
                selectedCity: option,
                selectedDistrict: {
                    id: null,
                    name: null
                },
                selectedWard: {
                    id: null,
                    name: null
                }
            });
        }
    }

    const onDistrictSelect = (option: responseDataLocation) => {
        if (option !== selectedDistrict) {
            setLocationState({
                ...locationState,
                wardOptions: [],
                selectedDistrict: option,
                selectedWard: {
                    id: null,
                    name: null
                }
            });
        }
    }

    const onWardSelect = (option: responseDataLocation) => {

        setLocationState({
            ...locationState,
            selectedWard: option,

        });

    }
    const onSubmit = (e: Event) => {
        e.preventDefault();
        window.location.reload();
    }

    return (
        <LocationContext.Provider value={{
            locationState,
            onSubmit,
            onWardSelect,
            onCitySelect,
            onDistrictSelect
        }

        }>
            {children}
        </LocationContext.Provider>
    )
}
export { LocationContext, LocationProvider };

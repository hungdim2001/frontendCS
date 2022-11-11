// ----------------------------------------------------------------------

import { locationObject } from "src/contexts/LocationContext";
import { responseDataLocation } from "src/service/app-apis/location";

export type ThemeMode = 'light' | 'dark';
export type ThemeDirection = 'rtl' | 'ltr';
export type ThemeColorPresets = 'default' | 'purple' | 'cyan' | 'blue' | 'orange' | 'red';
export type ThemeLayout = 'vertical' | 'horizontal';
export type ThemeStretch = boolean;

type ColorVariants = {
  name: string;
  lighter: string;
  light: string;
  main: string;
  dark: string;
  darker: string;
  contrastText: string;
};

export type SettingsValueProps = {
  themeMode: ThemeMode;
  themeDirection: ThemeDirection;
  themeColorPresets: ThemeColorPresets;
  themeStretch: ThemeStretch;
  themeLayout: ThemeLayout;
};

export type LocationContextProps = {
  onSubmit:(event: Event) => void;
  onWardSelect:(option: responseDataLocation)=> void;
  onCitySelect:(option: responseDataLocation)=> void;
  onDistrictSelect:(option: responseDataLocation)=> void;
  locationState:locationObject
  // cityOptions: Array<responseDataLocation>;
  // districtOptions: Array<responseDataLocation>;
  // wardOptions: Array<responseDataLocation>;
  // selectedCity: responseDataLocation;
  // selectedDistrict: responseDataLocation;
  // selectedWard: responseDataLocation
}
export type SettingsContextProps = {
  themeMode: ThemeMode;
  themeDirection: ThemeDirection;
  themeColorPresets: ThemeColorPresets;
  themeLayout: ThemeLayout;
  themeStretch: boolean;
  setColor: ColorVariants;
  colorOption: {
    name: string;
    value: string;
  }[];
  onToggleMode: VoidFunction;
  onToggleStretch: VoidFunction;
  onResetSetting: VoidFunction;
  onChangeMode: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeDirection: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeColor: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeLayout: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

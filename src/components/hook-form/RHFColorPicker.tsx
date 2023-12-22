// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { FormGroup, TextField, TextFieldProps } from '@mui/material';
import { MuiColorInput } from 'mui-color-input';
import Label from '../Label';
import ColorPicker from 'material-ui-color-picker';
import { HexColorPicker } from 'react-colorful';

// ----------------------------------------------------------------------

interface IProps {
  name: string;
}

export default function RHFColorPicker({ name, ...other }: IProps & TextFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller control={control} rules={{}} render={({ field }) => <input type='color'></input>} name={name} />
  );
}

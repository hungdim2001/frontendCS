// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { FormGroup, TextField, TextFieldProps } from '@mui/material';
import { MuiColorInput } from 'mui-color-input';
import Label from '../Label';
import ColorPicker from 'material-ui-color-picker';
import { HexColorPicker } from 'react-colorful';
import Editor, { Props as EditorProps } from '../editor';

// ----------------------------------------------------------------------

interface IProps extends EditorProps {
  name: string;
}

export default function RHFColorPicker({ name, value,...other }: IProps ) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      defaultValue={value}
      render={({ field, fieldState: { error } }) => (
        <input {...field} type="color"></input>
      )}
      name={name}
    />
  );
}

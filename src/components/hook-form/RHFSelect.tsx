// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField, TextFieldProps } from '@mui/material';
import Label from '../Label';

// ----------------------------------------------------------------------

interface IProps {
  name: string;
  children: any;
}

export default function RHFSelect({ name, children, ...other }: IProps & TextFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <TextField
            {...field}
            select
            fullWidth
            InputLabelProps={{ shrink: true }}
            SelectProps={{ native: true }}
            error={!!error}
            helperText={error?.message}
            {...other}
          >
            {children}
          </TextField>
        </>
      )}
    />
  );
}

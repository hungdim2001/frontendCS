import { Controller, useForm, useFormContext } from 'react-hook-form';
import {
  Checkbox,
  FormControl,
  FormControlLabelProps,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
} from '@mui/material';
interface Props extends Omit<FormControlLabelProps, 'control'> {
  name: string;
  items: any;
}
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
export default function RFHCheckMark({ name, label, items, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, ...otherOptions }) => {
        return (
          <Select
            {...field}
            style={{ width: '100%' }}
            multiple
            // value={field.value}
            // error={!!error}
            MenuProps={MenuProps}
            renderValue={(selected) => selected.map((item: any) => item.value).join(', ')}
            // renderValue={(selected: any) => {
            //   return (
            //     selected?.map((option: { value: string }) => option.value).join(', ') ||
            //     'Select some options'
            //   );
            // }}
            // defaultValue={[]}
          >
            <MenuItem key={'-1'} value={'-1'}>
              <Checkbox
                checked={
                  field.value &&
                  field.value
                    
                    .includes('-1')
                }
              />
              <ListItemText primary={'Select All'} />
            </MenuItem>
            {items.map((option: any) => (
              <MenuItem key={option.id} value={option}>
                <Checkbox
                  checked={
                    field.value && field.value.map((item: any) => item.value).includes(option.value)
                  }
                />
                <ListItemText primary={option.value} />
              </MenuItem>
            ))}
          </Select>
        );
      }}
    />
  );
}

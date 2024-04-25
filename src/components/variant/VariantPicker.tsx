// @mui
import { Box, Radio, RadioGroup, RadioGroupProps, BoxProps } from '@mui/material';
import { val } from 'cheerio/lib/api/attributes';
import { values } from 'lodash';
import { useEffect } from 'react';
import { ProductCharValue, Variant } from 'src/@types/product';

// ----------------------------------------------------------------------

interface Props extends RadioGroupProps {
  charValues: ProductCharValue[];
}

export default function VariantPicker({ charValues, value, ...other }: Props) {
  return (
    <RadioGroup  row {...other}>
      {charValues.map((charValue) => (
        <Radio
          checked={value.chars.includes(charValue.id)}
          key={charValue.id}
          value={charValue.id}
          icon={<IconColor charValue={charValue} variant={value} />}
          checkedIcon={
            <IconColor
              sx={{
                color: 'black',
                border: `2px solid #0C68F4`,
              }}
              charValue={charValue}
              variant={value}
            />
          }
          sx={{
            padding: 0,
            '&:hover': { opacity: 0.72 },
          }}
        />
      ))}
    </RadioGroup>
  );
}

// ----------------------------------------------------------------------
interface BoxProps1 extends BoxProps {
  charValue: ProductCharValue;
  variant: number[];
}

function IconColor({ charValue, variant, sx }: BoxProps1) {
  // const isCharValueInChars = variant.some((char) => char === charValue.id);
  return (
    <Box
      sx={{
        padding: 1,
        color: '#6F6F6F',
        display: 'flex',
        fontWeight: 500,
        fontSize: '14px',
        border: '1px solid #D5D5D5',
        borderRadius: 1,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        transition: (theme) =>
          theme.transitions.create('all', {
            duration: theme.transitions.duration.shortest,
          }),
        ...sx,
      }}
    >
      {charValue.value}
    </Box>
  );
}

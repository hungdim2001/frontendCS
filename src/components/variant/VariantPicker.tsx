// @mui
import { Box, Radio, RadioGroup, RadioGroupProps, BoxProps } from '@mui/material';
import { useEffect } from 'react';

// ----------------------------------------------------------------------

interface Props extends RadioGroupProps {
  variants: string[];
}

export default function VariantPicker({ variants, value, ...other }: Props) {
  useEffect(() => {
    console.log(value);
  }, [value]);
  return (
    <RadioGroup row {...other}>
      {variants.map((variant) => {
        return (
          <Radio
            key={variant}
            value={variant}
            icon={<IconColor variant={variant} />}
            checkedIcon={
              <IconColor
                sx={{
                  color: 'black',
                  border: `2px solid #0C68F4`,
                }}
                variant={variant}
              />
            }
            sx={{
              padding: 0,
              mr: 2,
              '&:hover': { opacity: 0.72 },
            }}
          />
        );
      })}
    </RadioGroup>
  );
}

// ----------------------------------------------------------------------
interface BoxProps1 extends BoxProps {
  variant: string;
}
function IconColor({ variant, sx }: BoxProps1) {
  return (
    <Box
      sx={{
        padding: 1,
        color: '#6F6F6F',
        display: 'flex',
        fontWeight: 500,
        fontSize: '14px',
        border: `1px solid #D5D5D5`,
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
      {variant}
    </Box>
  );
}

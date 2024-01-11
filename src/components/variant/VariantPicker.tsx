// @mui
import { Box, Radio, RadioGroup, RadioGroupProps } from '@mui/material';
// components
import Iconify from '../Iconify';
import theme from 'src/theme';

// ----------------------------------------------------------------------

interface Props extends RadioGroupProps {
  variants: string[];
}

export default function VariantPicker({ variants, ...other }: Props) {
  return (
    <RadioGroup row {...other}>
      {variants.map((color) => {
        const isWhite = color === '#FFFFFF' || color === 'white';

        return (
          <Radio
            key={color}
            value={color}
            color="default"
            icon={<IconColor variant={color} />}
            checkedIcon={<IconColor  variant={color} />
              // <IconColor
              //   sx={{
              //     transform: 'scale(1.4)',
              //     '&:before': {
              //       opacity: 0.48,
              //       width: '100%',
              //       content: "''",
              //       height: '100%',
              //       borderRadius: '50%',
              //       position: 'absolute',
              //       boxShadow: '4px 4px 8px 0 currentColor',
              //     },
              //     '& svg': { width: 12, height: 12, color: 'common.white' },
              //     ...(isWhite && {
              //       border: (theme) => `solid 1px ${theme.palette.divider}`,
              //       boxShadow: (theme) => `4px 4px 8px 0 ${theme.palette.grey[500_24]}`,
              //       '& svg': { width: 12, height: 12, color: 'common.black' },
              //     }),
              //   }}
              // />
            }
            sx={{
              color,
              '&:hover': { opacity: 0.72 },
            }}
          />
        );
      })}
    </RadioGroup>
  );
}

// ----------------------------------------------------------------------
interface BoxProps {
  variant: string;
}
function IconColor({ variant }: BoxProps) {
  return (
    <Box
      sx={{
        padding:1,
        color:'black',
        // width: 20,
        // height: 20,
        display: 'flex',
        border: `1px solid #D5D5D5`,
        borderRadius: 1,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        // bgcolor: 'currentColor',
        transition: (theme) =>
          theme.transitions.create('all', {
            duration: theme.transitions.duration.shortest,
          }),
        // ...sx,
      }}
      // {...other}
    >
      {variant}
      {/* <Iconify icon={'eva:checkmark-fill'} /> */}
    </Box>
  );
}

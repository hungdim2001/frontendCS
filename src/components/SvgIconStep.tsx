
import { Box, BoxProps } from '@mui/material';

// ----------------------------------------------------------------------

interface Props extends BoxProps {
  src: string;
  active: boolean;
}

export default function SvgIconStep({ src, sx, active }: Props) {
  return (
    <Box
      component="span"
      sx={{
        width:  32,
        height: 32,
        display: 'inline-block',
        bgcolor: 'currentColor',
        mask: `url(${src}) no-repeat center / contain`,
        WebkitMask: `url(${src}) no-repeat center / contain`,
        ...sx,
      }}
    />
  );
}

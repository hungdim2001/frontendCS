import { sentenceCase } from 'change-case';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Chip, Typography, Stack, Button } from '@mui/material';
// utils
import getColorName from '../../../../utils/getColorName';
// @type
import { ProductFilter } from '../../../../@types/product';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

const RootStyle = styled('div')({
  flexGrow: 1,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
});

const WrapperStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  overflow: 'hidden',
  alignItems: 'stretch',
  margin: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px ${theme.palette.divider}`,
}));

const LabelStyle = styled((props) => (
  <Typography component="span" variant="subtitle2" {...props} />
))(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.background.neutral,
  borderRight: `solid 1px ${theme.palette.divider}`,
}));

// ----------------------------------------------------------------------

function labelPriceRange(range: string) {
  if (range === 'below') {
    return 'Below $25';
  }
  if (range === 'between') {
    return 'Between $25 - $75';
  }
  return 'Above $75';
}

type Props = {
  filters: ProductFilter;
  isShowReset: boolean;
  onResetAll: VoidFunction;
  onRemovePrice: VoidFunction;
  onRemoveRating: VoidFunction;
  onRemoveCategory: VoidFunction;
  onRemoveColor: (value: string) => void;
  onRemoveBrand: (value: string) => void;
};

export default function ShopTagFiltered({
  filters,
  isShowReset,
  onRemoveBrand,
  onRemoveCategory,
  onRemoveColor,
  onRemovePrice,
  onRemoveRating,
  onResetAll,
}: Props) {
  const theme = useTheme();

  const {  brand, rating } = filters;

  return (
    <RootStyle>
      {brand.length > 0 && (
        <WrapperStyle>
          <LabelStyle>Brand:</LabelStyle>
          <Stack direction="row" flexWrap="wrap" sx={{ p: 0.75 }}>
            {brand.map((_brand) => (
              <Chip
                key={_brand}
                label={_brand}
                size="small"
                onDelete={() => onRemoveBrand(_brand)}
                sx={{ m: 0.5 }}
              />
            ))}
          </Stack>
        </WrapperStyle>
      )}

      {/* {category !== 'All' && (
        <WrapperStyle>
          <LabelStyle>Category:</LabelStyle>
          <Stack direction="row" flexWrap="wrap" sx={{ p: 0.75 }}>
            <Chip size="small" label={category} onDelete={onRemoveCategory} sx={{ m: 0.5 }} />
          </Stack>
        </WrapperStyle>
      )} */}
{/* 
      {colors.length > 0 && (
        <WrapperStyle>
          <LabelStyle>Colors:</LabelStyle>
          <Stack direction="row" flexWrap="wrap" sx={{ p: 0.75 }}>
            {colors.map((color) => (
              <Chip
                key={color}
                label={getColorName(color)}
                size="small"
                onDelete={() => onRemoveColor(color)}
                sx={{
                  m: 0.5,
                  bgcolor: color,
                  color: theme.palette.getContrastText(color),
                  ...((color === '#FFFFFF' || color === '#000000') && {
                    border: `solid 1px ${theme.palette.grey[500_32]}`,
                    '& .MuiChip-deleteIcon': {
                      color: 'text.disabled',
                    },
                  }),
                }}
              />
            ))}
          </Stack>
        </WrapperStyle>
      )} */}
{/* 
      {priceRange && (
        <WrapperStyle>
          <LabelStyle>Price:</LabelStyle>
          <Stack direction="row" flexWrap="wrap" sx={{ p: 0.75 }}>
            <Chip
              size="small"
              label={labelPriceRange(priceRange)}
              onDelete={onRemovePrice}
              sx={{ m: 0.5 }}
            />
          </Stack>
        </WrapperStyle>
      )} */}

      {rating && (
        <WrapperStyle>
          <LabelStyle>Rating:</LabelStyle>
          <Stack direction="row" flexWrap="wrap" sx={{ p: 0.75 }}>
            <Chip
              size="small"
              label={sentenceCase(rating)}
              onDelete={onRemoveRating}
              sx={{ m: 0.5 }}
            />
          </Stack>
        </WrapperStyle>
      )}

      {isShowReset && (
        <Button
          color="error"
          size="small"
          onClick={onResetAll}
          startIcon={<Iconify icon={'ic:round-clear-all'} />}
        >
          Clear All
        </Button>
      )}
    </RootStyle>
  );
}

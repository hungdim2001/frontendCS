import { paramCase } from 'change-case';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';

import { Box, Card, Link, Typography, Stack, IconButton, Button, Rating } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
// @types
import { Product } from '../../../../@types/product';
// components
import Label from '../../../../components/Label';
import Image from '../../../../components/Image';
import { ColorPreview } from '../../../../components/color-utils';
import Iconify from 'src/components/Iconify';
import { useState } from 'react';

// ----------------------------------------------------------------------

type Props = {
  product: Product;
};

export default function ShopProductCard({ product }: Props) {
  const { name, thumbnail, price, productSpecChars,id } = product;

  const linkTo = `${PATH_DASHBOARD.eCommerce.root}/product/${id}`;
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (

    <Card onClick={() => navigate(linkTo)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <Box sx={{ position: 'relative' }}>
        {price && (
          <Label
            variant="filled"
            color='error'
            sx={{
              top: 16,
              right: 16,
              zIndex: 9,
              position: 'absolute',
              textTransform: 'uppercase',
            }}
          >
            sale
          </Label>
        )}
        {hovered && (
          <Button
          onClick={(e)=>{
            e.stopPropagation();
            console.log("hetre")
          }}
            sx={{
              backgroundColor: '#ffab00',
              color: '#000000',
              boxShadow: '#ffab003d 0px 8px 16px 0px',
              cursor: 'pointer',
              bottom: 16,
              right: 16,
              zIndex: 9,
              position: 'absolute',
              borderRadius: '50%',
              width: 48,
              height: 48,
              transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 32,
              visibility: 'visible', // Show the button on hover
              opacity: 1, // Show the button on hover
              '&:hover': {
                backgroundColor: '#b76e00',
              },
            }}
          >
            <Iconify icon={'bxs:cart-add'} width={24} height={24} />
          </Button>
        )}

        <Image alt={name} src={thumbnail} ratio="1/1" />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        <Stack direction="column" alignItems="start" justifyContent="start">
          <Stack direction="row" alignItems="center" spacing={0.5}>
            {price && (
              <Typography
                component="span"
                sx={{ color: 'text.disabled', textDecoration: 'line-through' }}
              >
                {fCurrency(price)}₫
              </Typography>
            )}
            <Typography variant="subtitle1">{fCurrency(price)}₫</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            {productSpecChars?.[0]?.productSpecCharValueDTOS?.[0]?.value && (
              <Label variant="filled">
                {productSpecChars?.[0]?.productSpecCharValueDTOS?.[0]?.value}
              </Label>
            )}

            {productSpecChars?.[1]?.productSpecCharValueDTOS?.[1]?.value && (
              <Label variant="filled">
                {productSpecChars?.[1]?.productSpecCharValueDTOS?.[1]?.value}
              </Label>
            )}
          </Stack>
          <Rating readOnly={true} name="rating" defaultValue={4.5} precision={0.5} max={5} />
        </Stack>
      </Stack>
    </Card>
  );
}

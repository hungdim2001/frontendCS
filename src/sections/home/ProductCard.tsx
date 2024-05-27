import React from 'react';
import { Card, CardContent, CardMedia, Typography, Rating, Box } from '@mui/material';
import { Product } from 'src/@types/product';
import Image from '../../components/Image';
import { caculatorPercent, fCurrency } from 'src/utils/formatNumber';
import { PATH_DASHBOARD, PATH_ROOT } from 'src/routes/paths';
import { useNavigate } from 'react-router';
import Label from 'src/components/Label';
type Props = {
  product: Product;
};
const ProductCard = ({ product }: Props) => {
  const { name, thumbnail, images, price, productSpecChars, id, variants, ratingDTOS } = product;
  const linkTo = `${PATH_ROOT.products.root}/${id}/${
    variants.length > 1 ? variants[1].id : variants[0].id
  }`;
  const totalRating = ratingDTOS?.reduce(function (acc, obj) {
    return acc + obj.star;
  }, 0);
  const navigate = useNavigate();
  return (
    <Card
      onClick={() => {
        navigate(linkTo);
      }}
      sx={{ cursor: 'pointer', padding: '16px 0px', boxShadow: '-2px 2px 15px -1px #7171711F' }}
    >
      {variants.length > 1 ? (
        variants[1].discountPrice && (
          <Label
            variant="filled"
            sx={{
              backgroundColor: '#FDDBC9',
              color: '#F45E0C',
              top: '16px',
              padding: '4px',
              left: 0,
              zIndex: 9,
              borderRadius: '0px 4px 4px 0px',
              position: 'absolute',
            }}
          >
            {caculatorPercent(variants[1].discountPrice, variants[1].price)}%
          </Label>
        )
      ) : (
        <></>
      )}
      {variants[0].discountPrice && (
        <Label
          variant="filled"
          sx={{
            backgroundColor: '#FDDBC9',
            color: '#F45E0C',
            top: '16px',
            padding: '4px',
            left: 0,
            zIndex: 9,
            borderRadius: '0px 4px 4px 0px',
            position: 'absolute',
          }}
        >
          {caculatorPercent(variants[0].discountPrice, variants[0].price)}%
        </Label>
      )}
      <Image
        alt={name}
        src={variants.length > 1 ? variants[1]?.image.toString() : thumbnail}
        ratio="1/1"
        sx={{ marginBottom: '8px' }}
      />
      <Box
        sx={{
          flexGrow: 1,
          padding: '8px 16px',
          height: '90px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderTop: '1px solid #B4B4B4',
          borderImageSource:
            'linear-gradient(90deg, rgba(68, 68, 68, 0.1) 0%, rgba(16, 16, 16, 0.7) 54.17%, rgba(68, 68, 68, 0.1) 99.47%)',
          borderImageSlice: 1,
        }}
      >
        {' '}
        <Typography
          sx={{ textOverflow: 'ellipsis', overflow: 'hidden', maxHeight: '48px' }}
          variant="subtitle1"
          component="div"
        >
          {variants.length > 1
            ? name +
              ' ' +
              productSpecChars
                .flatMap((productSpecChar) => productSpecChar.productSpecCharValueDTOS)
                .filter((item) => variants[1].chars.includes(item?.id!))
                .map((item) => item?.value)
                .join(' ')
            : name}
        </Typography>
        {variants.length > 1 ? (
          <Typography
            component="span"
            sx={{
              color: 'text.disabled',
              textDecoration: 'line-through',
              display: variants[1].discountPrice ? 'block' : 'none',
            }}
          >
            {fCurrency(variants[1].price)}₫
          </Typography>
        ) : (
          <Typography
            component="span"
            sx={{
              color: 'text.disabled',
              textDecoration: 'line-through',
              display: variants[0].discountPrice ? 'block' : 'none',
            }}
          >
            {fCurrency(variants[0].price)}₫
          </Typography>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography component="div" variant="subtitle1">
            {variants.length > 1
              ? fCurrency(variants[1].discountPrice ? variants[1].discountPrice : variants[1].price)
              : fCurrency(variants[0].discountPrice!)
              ? variants[0].discountPrice
              : variants[0].price}
            ₫
          </Typography>
          <Typography
            component="div"
            sx={{
              display: 'flex',
              gap: 0.5,
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: '24px',
            }}
            color={'#063A88'}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.85873 1.51246C8.21795 0.406889 9.78205 0.406888 10.1413 1.51246L11.4248 5.46262C11.5854 5.95704 12.0461 6.2918 12.566 6.2918H16.7195C17.8819 6.2918 18.3653 7.77933 17.4248 8.46262L14.0646 10.9039C13.644 11.2095 13.468 11.7512 13.6287 12.2456L14.9122 16.1957C15.2714 17.3013 14.006 18.2207 13.0655 17.5374L9.70534 15.0961C9.28476 14.7905 8.71524 14.7905 8.29466 15.0961L4.93446 17.5374C3.994 18.2207 2.72862 17.3013 3.08784 16.1957L4.37133 12.2456C4.53198 11.7512 4.35599 11.2095 3.9354 10.9039L0.575201 8.46262C-0.365256 7.77934 0.118075 6.2918 1.28054 6.2918H5.43398C5.95385 6.2918 6.4146 5.95704 6.57525 5.46262L7.85873 1.51246Z"
                fill="#063A88"
              />
            </svg>
            {totalRating ? Number((totalRating / ratingDTOS.length).toFixed(1)) : 5}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default ProductCard;

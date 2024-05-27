import { useState } from 'react';
// @mui
import { Box, List, Button, Rating,  ListItem, Pagination, Typography } from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
import { fShortenNumber } from '../../../../utils/formatNumber';
// @types
import { Product, ProductReview, Rating as RatingType} from '../../../../@types/product';
// components
import Iconify from '../../../../components/Iconify';
import Avatar from 'src/components/Avatar';
import MyAvatar from 'src/components/MyAvatar';

// ----------------------------------------------------------------------

type Props = {
  product: Product;
};

export default function ProductDetailsReviewList({ product }: Props) {
  const { ratingDTOS } = product;

  return (
    <Box sx={{ pt: 3, px: 2, pb: 5 }}>
      <List disablePadding>
        {ratingDTOS?.map((rating) => (
          <ReviewItem key={rating.id} ratingType={rating} />
        ))}
      </List>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Pagination count={10} color="primary" />
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

type ReviewItemProps = {
  // review: ProductReview;
  ratingType: RatingType;
};

function ReviewItem({ ratingType }: ReviewItemProps) {
  const [isHelpful, setHelpfuls] = useState(false);

  const { fullName,star , comment, createDatetime } = ratingType;

  const handleClickHelpful = () => {
    setHelpfuls((prev) => !prev);
  };

  return (
    <>
      <ListItem
        disableGutters
        sx={{
          mb: 5,
          alignItems: 'flex-start',
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Box
          sx={{
            mr: 2,
            display: 'flex',
            alignItems: 'center',
            mb: { xs: 2, sm: 0 },
            minWidth: { xs: 160, md: 240 },
            textAlign: { sm: 'center' },
            flexDirection: { sm: 'column' },
          }}
        >
         <MyAvatar/> 
          <div>
            <Typography variant="subtitle2" noWrap>
              {fullName}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
              {fDate(createDatetime!)}
            </Typography>
          </div>
        </Box>

        <div>
          <Rating size="small" value={star} precision={0.1} readOnly />

          {/* {isPurchased && (
            <Typography
              variant="caption"
              sx={{
                my: 1,
                display: 'flex',
                alignItems: 'center',
                color: 'primary.main',
              }}
            >
              <Iconify icon={'ic:round-verified'} width={16} height={16} />
              &nbsp;Verified purchase
            </Typography>
          )} */}

          <Typography variant="body2">{comment}</Typography>
{/* 
          <Box
            sx={{
              mt: 1,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            {!isHelpful && (
              <Typography variant="body2" sx={{ mr: 1 }}>
                Was this review helpful to you?
              </Typography>
            )}

            <Button
              size="small"
              color="inherit"
              startIcon={<Iconify icon={!isHelpful ? 'ic:round-thumb-up' : 'eva:checkmark-fill'} />}
              onClick={handleClickHelpful}
            >
              {isHelpful ? 'Helpful' : 'Thank'}({fShortenNumber(!isHelpful ? helpful : helpful + 1)}
              )
            </Button>
          </Box> */}
        </div>
      </ListItem>
    </>
  );
}

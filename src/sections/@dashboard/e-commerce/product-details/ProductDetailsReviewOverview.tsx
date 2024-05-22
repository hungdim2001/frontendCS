import sumBy from 'lodash/sumBy';
// @mui
import { styled } from '@mui/material/styles';
import { Grid, Rating, Button, Typography, LinearProgress, Stack, Link } from '@mui/material';
// utils
import { fShortenNumber } from '../../../../utils/formatNumber';
// @types
import { Product } from '../../../../@types/product';
// components
import Iconify from '../../../../components/Iconify';
import { store } from 'emoji-mart';

// ----------------------------------------------------------------------

const RatingStyle = styled(Rating)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

const GridStyle = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  '&:nth-of-type(2)': {
    [theme.breakpoints.up('md')]: {
      borderLeft: `solid 1px ${theme.palette.divider}`,
      borderRight: `solid 1px ${theme.palette.divider}`,
    },
  },
}));

// ----------------------------------------------------------------------

type Props = {
  product: Product;
  onOpen: VoidFunction;
};
type StarRating = {
  name: string;
  totalStar: number;
};

type ProgressItemProps = {
  star: StarRating;
  total: number;
};
export default function ProductDetailsReviewOverview({ product, onOpen }: Props) {
  const { ratingDTOS } = product;
  const totalRating = ratingDTOS.reduce(function (acc, obj) {
    return acc + 1;
  }, 0);
  const ratingGroups =
    ratingDTOS.length > 0
      ? ratingDTOS.slice(1).reduce(
          function (acc: StarRating[], obj) {
            const existingItem = acc.find((item) => item.name === obj.star.toString());
            if (existingItem) {
              existingItem.totalStar += 1;
            } else {
              acc.push({
                name: obj.star.toString(),
                totalStar: 1,
              });
            }
            return acc;
          },
          [{ name: ratingDTOS[0].star.toString(), totalStar: 1 }]
        )
      : [];

  const storedRating = ratingGroups.sort((a, b) => b.totalStar - a.totalStar);
  const averageRating = Number((totalRating / ratingDTOS.length).toFixed(1));

  return (
    <Grid container>
      <GridStyle item xs={12} md={4}>
        <Typography variant="subtitle1" gutterBottom>
          Average rating
        </Typography>
        <Typography variant="h2" gutterBottom sx={{ color: 'error.main' }}>
          {averageRating}/5
        </Typography>
        <RatingStyle readOnly value={averageRating} precision={0.1} />
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          ({fShortenNumber(ratingDTOS.length)}
          &nbsp;reviews)
        </Typography>
      </GridStyle>

      <GridStyle item xs={12} md={4}>
        <Stack spacing={1.5} sx={{ width: 1 }}>
          {storedRating.map((rating) => (
            <ProgressItem key={rating.name} star={rating} total={totalRating} />
          ))}
        </Stack>
      </GridStyle>

      <GridStyle item xs={12} md={4}>
        <Link href="#move_add_review" underline="none">
          <Button
            size="large"
            onClick={onOpen}
            variant="outlined"
            startIcon={<Iconify icon={'eva:edit-2-fill'} />}
          >
            Write your review
          </Button>
        </Link>
      </GridStyle>
    </Grid>
  );
}

// ----------------------------------------------------------------------

function ProgressItem({ star, total }: ProgressItemProps) {
  const { name, totalStar } = star;
  return (
    <Stack direction="row" alignItems="center" spacing={1.5}>
      <Typography variant="subtitle2">{name} star</Typography>
      <LinearProgress
        variant="determinate"
        value={(totalStar / total) * 100}
        sx={{
          mx: 2,
          flexGrow: 1,
          bgcolor: 'divider',
        }}
      />
      <Typography
        variant="body2"
        sx={{ color: 'text.secondary', minWidth: 64, textAlign: 'right' }}
      >
        {fShortenNumber(totalStar)}
      </Typography>
    </Stack>
  );
}

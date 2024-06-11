import { useEffect, useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import {
  Input,
  Slide,
  Button,
  InputAdornment,
  ClickAwayListener,
  IconButton,
  Grid,
  Typography,
  Stack,
  Box,
} from '@mui/material';
// utils
import cssStyles from '../../../utils/cssStyles';
// components
import Iconify from '../../../components/Iconify';
import { DialogAnimate, IconButtonAnimate } from '../../../components/animate';
import SvgIconStyle from 'src/components/SvgIconStyle';
import { dispatch, useDispatch, useSelector } from 'src/redux/store';
import { getProductSearch, getProducts } from 'src/redux/slices/product';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import ProductCard from 'src/sections/home/ProductCard';
import { ActionAudit, logApi } from 'src/service/app-apis/log';
import useLocationContext from 'src/hooks/useLocation';
import useAuth from 'src/hooks/useAuth';
// ----------------------------------------------------------------------

const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const SearchbarStyle = styled('div')(({ theme }) => ({
  maxWidth: 'xs',
  height: APPBAR_MOBILE,
}));
interface FormValuesProps {
  keyword: string;
}
// ----------------------------------------------------------------------
export default function SearchModal() {
  const [isOpen, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [keyword, setKeyword] = useState('');
  useEffect(() => {}, [keyword]);
  const SearchSchema = Yup.object().shape({});
  const defaultValues = {
    keyword: '',
  };
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(SearchSchema),
    defaultValues,
  });
  useEffect(() => {
    setValue('keyword', '');
     dispatch(getProductSearch(false, null, null, true));
  }, [isOpen]);
  const { handleSubmit, setValue } = methods;
  const { currentLocation } = useLocationContext();
  const { user } = useAuth();
  const onSubmit = async (data: FormValuesProps) => {
    if (data.keyword) {
        const log: ActionAudit = (await {
          userId: user?.id,
          ipClient: currentLocation.ip,
          actionTime: new Date(),
          action: 'SEARCH',
          deviceType: '',
          keyWord: data.keyword,
          lat: currentLocation.lat,
          lon: currentLocation.lon,
          road: currentLocation.address.road,
          quarter: currentLocation.address.quarter,
          suburb: currentLocation.address.suburb,
          city: currentLocation.address.city,
          postcode: currentLocation.address.postcode,
          country: currentLocation.address.country,
          country_code: currentLocation.address.country_code,
        }) as ActionAudit;
        await logApi.createLog(log);
      await dispatch(getProductSearch(false, null, data.keyword, false));
    }
  };
  const { productsSearch } = useSelector((state) => state.product);
  return (
    <>
      <IconButton onClick={handleOpen} sx={{ color: '#0c0c0c' }} type="button">
        <SvgIconStyle src={'/icons/ic_search-normal.svg'} />
      </IconButton>
      <DialogAnimate open={isOpen} onClose={handleClose} sx={{ padding: '32px 48px' }}>
        <SearchbarStyle>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <RHFTextField
              placeholder="What can we help you to find ?"
              autoFocus
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <Button type="submit">
                      <Iconify
                        icon={'eva:search-fill'}
                        sx={{ cursor: 'pointer', color: '#444444', width: 20, height: 20 }}
                      />
                    </Button>
                  </InputAdornment>
                ),
              }}
              sx={{
                padding: '4px',
                '& fieldset': { border: 'none' },
                mr: 1,
                fontWeight: 300,
                border: '1px solid #444444',
                outline: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                boxShadow: '0px 2px 2px #00000040',
              }}
              name="keyword"
            />
          </FormProvider>
        </SearchbarStyle>
        <Grid container>
          <Grid item md={12}>
            <Typography variant="h5"> Most used keywords</Typography>
          </Grid>
          <Grid item md={4}>
            <Stack>
              <Typography>Iphone x</Typography>
            </Stack>
          </Grid>
          <Grid item md={8}>
            <Box
              sx={{
                display: 'grid',
                gap: 3,
                marginTop: '20px',
                gridTemplateColumns: {
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)',
                },
              }}
            >
              {productsSearch?.length > 0 ? (
                productsSearch?.map((product, index) => (
                  <ProductCard onClose={handleClose} key={product.id} product={product} />
                ))
              ) : (
                <></>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogAnimate>
    </>
  );
}

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
} from '@mui/material';
// utils
import cssStyles from '../../../utils/cssStyles';
// components
import Iconify from '../../../components/Iconify';
import { DialogAnimate, IconButtonAnimate } from '../../../components/animate';
import SvgIconStyle from 'src/components/SvgIconStyle';
import { dispatch } from 'src/redux/store';
import { getProducts } from 'src/redux/slices/product';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
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
  useEffect(() => {
    dispatch(getProducts(false, null, null));
  }, [dispatch]);
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
  const { handleSubmit } = methods;
  const onSubmit = async (data: FormValuesProps) => {
  };

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
                    <Iconify
                      icon={'eva:search-fill'}
                      sx={{ cursor: 'pointer', color: '#444444', width: 20, height: 20 }}
                    />
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
          {/* <Input
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
            }}
          /> */}
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
          <Grid item md={8}></Grid>
        </Grid>
      </DialogAnimate>
    </>
  );
}

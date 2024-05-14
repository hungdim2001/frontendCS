import { useState } from 'react';
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

// ----------------------------------------------------------------------

const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const SearchbarStyle = styled('div')(({ theme }) => ({
  maxWidth: 'xs',
  height: APPBAR_MOBILE,
}));

// ----------------------------------------------------------------------
export default function SearchModal() {
  const [isOpen, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton onClick={handleOpen} sx={{ color: '#0c0c0c' }} type="button">
        <SvgIconStyle src={'/icons/ic_search-normal.svg'} />
      </IconButton>
      <DialogAnimate open={isOpen} onClose={handleClose} sx={{ padding: '32px 48px' }}>
        <SearchbarStyle>
          <Input
            autoFocus
            fullWidth
            disableUnderline
            placeholder="What can we help you to find ?"
            endAdornment={
              <InputAdornment position="start">
                <Iconify
                  icon={'eva:search-fill'}
                  sx={{ cursor: 'pointer', color: '#444444', width: 20, height: 20 }}
                />
              </InputAdornment>
            }
            sx={{
              padding: '4px',
              mr: 1,
              fontWeight: 300,
              border: '1px solid #444444',
              borderRadius: '4px',
              fontSize: '14px',
              boxShadow: '0px 2px 2px #00000040',
            }}
          />
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

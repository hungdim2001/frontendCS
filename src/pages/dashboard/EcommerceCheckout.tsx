import { useEffect } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Grid,
  Step,
  Stepper,
  Container,
  StepLabel,
  StepConnector,
  StepIconProps,
  stepConnectorClasses,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getCart, createBilling } from '../../redux/slices/product';
// routes
import { PATH_ROOT } from '../../routes/paths';
// hooks
import useIsMountedRef from '../../hooks/useIsMountedRef';
import useSettings from '../../hooks/useSettings';
// components
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import {
  CheckoutCart,
  CheckoutPayment,
  CheckoutOrderComplete,
  CheckoutBillingAddress,
} from '../../sections/@dashboard/e-commerce/checkout';
import SvgIconStep from 'src/components/SvgIconStep';
import useAuth from 'src/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { UserMenu, setOptionMenuSelected } from 'src/redux/slices/menu';

// ----------------------------------------------------------------------

const STEPS = ['', '', ''];

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: theme.palette.primary.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: theme.palette.divider,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: '#9e9e9e',
  zIndex: 1,
  color: '#fff',
  width: 48,
  height: 48,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundColor: '#fff',
    color: theme.palette.primary.main,
    border: `3px solid ${theme.palette.primary.main}`,
    borderRadius: '50%',
  }),
  ...(ownerState.completed && {
    color: '#fff',
    backgroundColor: '#0c68f4bf',
  }),
}));

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  top: '24px',
  left: 'calc(-50% + 24px)',
  right: 'calc(50% + 24px)',
  '& .MuiStepConnector-line': {
    borderTopWidth: 2,
    borderColor: theme.palette.divider,
  },
  '&.Mui-active, &.Mui-completed': {
    '& .MuiStepConnector-line': {
      borderColor: theme.palette.primary.main,
    },
  },
}));
function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <SvgIconStep active={active!} src={'/icons/ic_bag_happy.svg'} />,
    2: <SvgIconStep active={active!} src={'/icons/ic_truck.svg'} />,
    3: <SvgIconStep active={active!} src={'/icons/ic_card.svg'} />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}
// ----------------------------------------------------------------------
const RootStyle = styled('div')(({ theme }) => ({
  height: '100%',
  marginTop: '77px',
}));

export default function EcommerceCheckout() {
  const { themeStretch } = useSettings();

  const dispatch = useDispatch();
  const isMountedRef = useIsMountedRef();

  const { checkout } = useSelector((state) => state.product);

  const { cart, billing, activeStep } = checkout;

  const isComplete = activeStep === STEPS.length;
  useEffect(() => {
    if (isMountedRef.current) {
      dispatch(getCart(cart));
    }
  }, [dispatch, isMountedRef, cart]);

  useEffect(() => {
    if (activeStep === 1) {
      dispatch(createBilling(null));
    }
  }, [dispatch, activeStep]);
  return (
    <RootStyle>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: 'Home', href: '/' },
            {
              name: 'Products',
              href: PATH_ROOT.products.root,
            },
            { name: 'Checkout' },
          ]}
        />

        <Grid container justifyContent={isComplete ? 'center' : 'flex-start'}>
          <Grid item xs={12} md={8} sx={{ mb: 5 }}>
            <Stepper
              sx={{
                alignItems: 'center',
              }}
              alternativeLabel
              activeStep={activeStep}
              connector={<QontoConnector />}
            >
              {STEPS.map((label, index) => (
                <Step key={index}>
                  <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Grid>
        </Grid>

        {!isComplete ? (
          <>
            {activeStep === 0 && <CheckoutCart />}
            {activeStep === 1 && <CheckoutBillingAddress />}
            {activeStep === 2 && billing && <CheckoutPayment />}
          </>
        ) : (
          // <CheckoutOrderComplete open={isComplete} />
          <CheckoutOrderComplete />
        )}
      </Container>
    </RootStyle>
  );
}

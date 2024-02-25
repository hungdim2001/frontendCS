import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Grid, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// @types
import { CardOption, PaymentOption, DeliveryOption } from '../../../../@types/product';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import {
  onGotoStep,
  onBackStep,
  onNextStep,
  applyShipping,
  getDelevirySerives,
} from '../../../../redux/slices/product';
// components
import Iconify from '../../../../components/Iconify';
import { FormProvider } from '../../../../components/hook-form';
//
import CheckoutSummary from './CheckoutSummary';
import CheckoutDelivery from './CheckoutDelivery';
import CheckoutBillingInfo from './CheckoutBillingInfo';
import CheckoutPaymentMethods from './CheckoutPaymentMethods';
import { useEffect, useMemo, useState } from 'react';

// ----------------------------------------------------------------------

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    value: 'vnpay',
    title: 'Pay with VNPay', 
    description: 'You will be redirected to PayPal website to complete your purchase securely.',
    icons: '/icons/ic_vnpay.svg',
  },
  // {
  //   value: 'credit_card',
  //   title: 'Credit / Debit Card',
  //   description: 'We support Mastercard, Visa, Discover and Stripe.',
  //   icons: [
  //     'https://minimal-assets-api.vercel.app/assets/icons/ic_mastercard.svg',
  //     'https://minimal-assets-api.vercel.app/assets/icons/ic_visa.svg',
  //   ],
  // },
  {
    value: 'cash',
    title: 'Cash on Delivery',
    description: 'Pay with cash when your order is delivered.',
    icons: '',
  },
];

const CARDS_OPTIONS: CardOption[] = [
  { value: 'ViSa1', label: '**** **** **** 1212 - Jimmy Holland' },
  { value: 'ViSa2', label: '**** **** **** 2424 - Shawn Stokes' },
  { value: 'MasterCard', label: '**** **** **** 4545 - Cole Armstrong' },
];

type FormValuesProps = {
  delivery: number;
  payment: string;
};

export default function CheckoutPayment() {
  const dispatch = useDispatch();
  const { checkout } = useSelector((state) => state.product);

  const { total, discount, subtotal, shipping } = checkout;

  const handleNextStep = () => {
    dispatch(onNextStep());
  };

  const handleBackStep = () => {
    dispatch(onBackStep());
  };

  const handleGotoStep = (step: number) => {
    dispatch(onGotoStep(step));
  };

  const handleApplyShipping = (value: number) => {
    dispatch(applyShipping(value));
  };

  const PaymentSchema = Yup.object().shape({
    payment: Yup.string().required('Payment is required!'),
  });

  const onSubmit = async () => {
    try {
      console.log('payment')
      // handleNextStep();
    } catch (error) {
      console.error(error);
    }
  };

  const { billing, deliveryServices } = useSelector((state) => state.product.checkout);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeliveryServices = async () => {
      if (billing?.district) {
        await dispatch(getDelevirySerives(billing?.district, billing.ward));
        setLoading(false);
      }
    };

    fetchDeliveryServices();
  }, [billing, dispatch]);

  const defaultValues = useMemo(() => {
    if (!loading && deliveryServices[0]?.total) {
      return {
        delivery: deliveryServices[0].total,
        payment: '',
      };
    }
    return {
      delivery: 0,
      payment: '',
    };
  }, [loading, deliveryServices]);

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(PaymentSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;
  if (!deliveryServices) return <></>;
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <CheckoutDelivery
            deliveryServices={deliveryServices}
            onApplyShipping={handleApplyShipping}
          />
          <CheckoutPaymentMethods cardOptions={CARDS_OPTIONS} paymentOptions={PAYMENT_OPTIONS} />
          <Button
            size="small"
            color="inherit"
            onClick={handleBackStep}
            startIcon={<Iconify icon={'eva:arrow-ios-back-fill'} />}
          >
            Back
          </Button>
        </Grid>

        <Grid item xs={12} md={4}>
          <CheckoutBillingInfo onBackStep={handleBackStep} />

          <CheckoutSummary
            enableEdit
            total={total}
            subtotal={subtotal}
            discount={discount}
            shipping={shipping}
            onEdit={() => handleGotoStep(0)}
          />
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Complete Order
          </LoadingButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

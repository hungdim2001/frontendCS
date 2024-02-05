import { createSlice } from '@reduxjs/toolkit';
import sum from 'lodash/sum';
import uniqBy from 'lodash/uniqBy';
// utils
import axios from '../../utils/axios';
import { CartItem, Product, ProductState } from '../../@types/product';
//
import { dispatch } from '../store';
import { productApi } from 'src/service/app-apis/product';
import { defaultCaculateFeeRequest, defaultItem, ghnApi } from 'src/service/app-apis/ghn';
import { cartApi } from 'src/service/app-apis/cart';

// ----------------------------------------------------------------------

const initialState: ProductState = {
  isLoading: false,
  error: null,
  products: [],
  product: null,
  sortBy: null,
  filters: {
    gender: [],
    category: 'All',
    colors: [],
    priceRange: '',
    rating: '',
  },
  checkout: {
    deliveryServices: [],
    activeStep: 0,
    cart: [],
    subtotal: 0,
    total: 0,
    discount: 0,
    shipping: 0,
    billing: null,
  },
};

const slice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET PRODUCTS
    getProductsSuccess(state, action) {
      state.isLoading = false;
      state.products = action.payload;
    },

    // GET PRODUCT
    getProductSuccess(state, action) {
      state.isLoading = false;
      state.product = action.payload;
    },

    //  SORT & FILTER PRODUCTS
    sortByProducts(state, action) {
      state.sortBy = action.payload;
    },

    filterProducts(state, action) {
      state.filters.gender = action.payload.gender;
      state.filters.category = action.payload.category;
      state.filters.colors = action.payload.colors;
      state.filters.priceRange = action.payload.priceRange;
      state.filters.rating = action.payload.rating;
    },

    // CHECKOUT
    getCart(state, action) {
      const cart = action.payload;

      const subtotal = sum(
        cart.map((cartItem: CartItem) => cartItem.variant.price * cartItem.quantity)
      );
      const discount = cart.length === 0 ? 0 : state.checkout.discount;
      const shipping = cart.length === 0 ? 0 : state.checkout.shipping;
      const billing = cart.length === 0 ? null : state.checkout.billing;

      state.checkout.cart = cart;
      state.checkout.discount = discount;
      state.checkout.shipping = shipping;
      state.checkout.billing = billing;
      state.checkout.subtotal = subtotal;
      state.checkout.total = subtotal - discount;
    },

    addCart(state, action) {
      state.isLoading = false;
      const newCartItem = action.payload.map((cartItem: CartItem) => {
        const variant = state.products
          .flatMap((product) => product.variants)
          .find((variant) => 
            variant.id === cartItem.variantId
          );
        cartItem.variant = variant!;
        return cartItem;
      });
      state.checkout.cart = newCartItem;
      // const product = action.payload;
      // const isEmptyCart = state.checkout.cart.length === 0;
      // if (isEmptyCart) {
      //   state.checkout.cart = [...state.checkout.cart, product];
      // } else {
      //   state.checkout.cart = state.checkout.cart.map((_product) => {
          // const isExisted = _product.variant.id === product.variant.id;
      //     if (isExisted) {
      //       return {
      //         ..._product,
      //         quantity: _product.quantity + product.quantity,
      //       };
      //     }
      //     return _product;
      //   });
      // }
      // state.checkout.cart = uniqBy([...state.checkout.cart, product], 'variant.id');
    },

    deleteCart(state, action) {
      const updateCart = state.checkout.cart.filter((item) => item.variant.id !== action.payload);

      state.checkout.cart = updateCart;
    },

    resetCart(state) {
      state.checkout.activeStep = 0;
      state.checkout.cart = [];
      state.checkout.total = 0;
      state.checkout.subtotal = 0;
      state.checkout.discount = 0;
      state.checkout.shipping = 0;
      state.checkout.billing = null;
    },

    onBackStep(state) {
      state.checkout.activeStep -= 1;
    },

    onNextStep(state) {
      state.checkout.activeStep += 1;
    },

    onGotoStep(state, action) {
      const goToStep = action.payload;
      state.checkout.activeStep = goToStep;
    },

    increaseQuantity(state, action) {
      const productId = action.payload;
      const updateCart = state.checkout.cart.map((product) => {
        if (product.variant.id === productId) {
          return {
            ...product,
            quantity: product.quantity + 1,
          };
        }
        return product;
      });

      state.checkout.cart = updateCart;
    },

    decreaseQuantity(state, action) {
      const productId = action.payload;
      const updateCart = state.checkout.cart.map((product) => {
        if (product.variant.id === productId) {
          return {
            ...product,
            quantity: product.quantity - 1,
          };
        }
        return product;
      });

      state.checkout.cart = updateCart;
    },

    createBilling(state, action) {
      state.checkout.billing = action.payload;
    },
    getDeliverySuccess(state, action) {
      state.checkout.deliveryServices = action.payload;
    },
    applyDiscount(state, action) {
      const discount = action.payload;
      state.checkout.discount = discount;
      state.checkout.total = state.checkout.subtotal - discount;
    },

    applyShipping(state, action) {
      const shipping = action.payload;
      state.checkout.shipping = shipping;
      state.checkout.total = state.checkout.subtotal - state.checkout.discount + shipping;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  getCart,
  addCart,
  resetCart,
  onGotoStep,
  onBackStep,
  onNextStep,
  deleteCart,
  createBilling,
  applyShipping,
  applyDiscount,
  getDeliverySuccess,
  increaseQuantity,
  decreaseQuantity,
  sortByProducts,
  filterProducts,
} = slice.actions;

// ----------------------------------------------------------------------
export function addToCart(cartItem: CartItem) {
  return async () => {
    const response = await cartApi.addToCart({ ...cartItem, variantId: cartItem.variant.id! });
    dispatch(slice.actions.addCart(response));
  };
  // const product = slice.action.payload;
  // const isEmptyCart = dispatch(getCart())=== 0;
  // if (isEmptyCart) {
  //   state.checkout.cart = [...state.checkout.cart, product];
  // } else {
  //   state.checkout.cart = state.checkout.cart.map((_product) => {
  //     const isExisted = _product.variant.id === product.variant.id;
  //     if (isExisted) {
  //       return {
  //         ..._product,
  //         quantity: _product.quantity + product.quantity,
  //       };
  //     }
  // }
  // state.checkout.cart = uniqBy([...state.checkout.cart, product], 'variant.id');
}
export function deleteProducts(ids: number[]) {
  return async () => {
    try {
      await productApi.deleteProducts(ids);
      const response = await productApi.getProducts(null);
      dispatch(slice.actions.getProductsSuccess(response));
    } catch (error) {
      console.log(error);
    }
  };
}

export function getProducts() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await productApi.getProducts(null);
      dispatch(slice.actions.getProductsSuccess(response));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getProduct(id: number) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await productApi.getProducts(id);
      dispatch(slice.actions.getProductSuccess(response[0]));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getDelevirySerives(district: number, ward: number) {
  return async (dispatch: any) => {
    dispatch(slice.actions.startLoading());
    try {
      const deliveryServices = await ghnApi.getService({
        shop_id: 4875027,
        from_district: 3440,
        to_district: district,
      });
      const newDeliveryService = await Promise.all(
        deliveryServices.map(async (item) => {
          const estimateTimeResponse = await ghnApi.getEstimateTime({
            from_district_id: 3440,
            from_ward_code: '13004', // convert to string directly
            to_district_id: district,
            to_ward_code: ward + '', // convert to string
            service_id: item.service_id,
          });
          console.log('here');
          const response = await ghnApi.caculateFee({
            ...defaultCaculateFeeRequest,
            service_id: item.service_id,
            to_district_id: district,
            to_ward_code: ward + '',
            items: [{ ...defaultItem }],
          });
          return {
            ...item,
            estimate_delivery_time: estimateTimeResponse.leadtime,
            total: response.total,
          };
        })
      );
      dispatch(getDeliverySuccess(newDeliveryService));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

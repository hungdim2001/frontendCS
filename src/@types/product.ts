import { CustomFile } from 'src/components/upload';
import { BaseDTO } from './common';

export type PaymentType = 'paypal' | 'credit_card' | 'cash' | 'vnpay';

export type ProductStatus = 'sale' | 'new' | '';

export type ProductInventoryType = 'in_stock' | 'out_of_stock' | 'low_stock';

export type ProductCategory = 'Accessories' | 'Apparel' | 'Shoes' | string;

export type ProductGender = 'Men' | 'Women' | 'Kids' | string;

export type OnCreateBilling = (address: Address) => void;

export type ProductRating = {
  name: string;
  starCount: number;
  reviewCount: number;
};

export type ProductReview = {
  id: string;
  name: string;
  avatarUrl: string;
  comment: string;
  rating: number;
  isPurchased: boolean;
  helpful: number;
  postedAt: Date | string | number;
};
type CharValues = Record<string, string>;

export type Variant = BaseDTO & {
  name: string;
  chars: number[];
  quantity: number;
  price: number;
  discountPrice: number | null;
  image: string | CustomFile;
  charValues: CharValues;
};

export type ProductChar = BaseDTO & {
  name: string;
  productSpecCharValueDTOS: ProductCharValue[] | null;
};
export type ProductType = BaseDTO & {
  icon: string;
  name: string;
};
export type Rating = BaseDTO & {
  comment: string;
  productId: number;
  star: number;
  userId: number;
  fullName:string;
};
export type ProductCharState = {
  productChars: ProductChar[] | [];
  productChar: ProductChar;
};

export type ProductTypeState = {
  productTypes: ProductType[];
};
export type AddressState = {
  adresss: Address[];
};
export type MenuState = {
  optionSelected: any;
};
export type ProductCharValue = BaseDTO & {
  value: string;
  variant: boolean;
};
export type Product = BaseDTO & {
  thumbnail: string;
  images: string[];
  name: string;
  price: number;
  quantity: number;
  productType: ProductType;
  productSpecChars: ProductChar[];
  valueSelected: ProductCharValue[];
  variants: Variant[];
  ratingDTOS: Rating[]
  // tags: string[];
  // priceSale: number | null;
  // totalRating: number;
  // totalReview: number;
  // ratings: ProductRating[];
  // reviews: ProductReview[];
  // colors: string[];
  // status: ProductStatus;
  // inventoryType: ProductInventoryType;
  // sizes: string[];

  // sold: number;
  // createdAt: Date | string | number;
  // category: ProductCategory;
  // gender: ProductGender;
};
export type OrderRequest = {
  shippingMethod: string;
  shippingFee: number;
  estimateDate: number;
  addressId: number;
};
export type CartItem = BaseDTO & {
  cartId: number;
  name: string;
  variantId: number;
  variant: Variant;
  quantity: number;
  subtotal: number;
};

export type BillingAddress = {
  receiver: string;
  phone: string;
  addressType: string;
  isDefault: boolean;
};

export type Address = BaseDTO & {
  receiver: string;
  phone: string;
  userId: number;
  addressType: string;
  isDefault: boolean;
  fullName: string;
  province: number;
  district: number;
  ward: number;
  address: string;
  lon: number;
  lat: number;
};
export type DeliveryService = {
  service_id: number;
  short_name: string;
  total: number;
  service_type_id: number;
  estimate_delivery_time: number;
};
export type ProductState = {
  isLoading: boolean;
  error: Error | string | null;
  products: Product[];
  product: Product | null;
  sortBy: string | null;
  filters: {
    brand: string[];
    rating: string;
  };
  checkout: {
    deliveryServices: DeliveryService[];
    activeStep: number;
    cart: CartItem[];
    subtotal: number;
    total: number;
    discount: number;
    shipping: number;
    billing: Address | null;
  };
};

export type ProductFilter = {
  brand: string[];
  rating: string;
};

export type DeliveryOption = {
  value: number;
  title: string;
  description: string;
};

export type PaymentOption = {
  value: PaymentType;
  title: string;
  description: string;
  icons: string;
};

export type CardOption = {
  value: string;
  label: string;
};

export type Invoice = {
  id: string;
  taxes: number;
  discount: number;
  status: string;
  invoiceFrom: {
    name: string;
    address: string;
    company: string;
    email: string;
    phone: string;
  };
  invoiceTo: {
    name: string;
    address: string;
    company: string;
    email: string;
    phone: string;
  };
  items: {
    id: string;
    title: string;
    description: string;
    qty: number;
    price: number;
  }[];
};

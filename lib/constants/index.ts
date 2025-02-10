import { ShippingAddress } from "@/types";

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Modern Ecommerce store";
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.LATEST_PRODUCTS_LIMIT) || 6;
export const signInDefaultValues = {
  email: "admin@example.com",
  password: "123456",
};
export const signUpDefaultValues = {
  name: "Ankit",
  email: "ankit@gmail.com",
  password: "12345",
  confirmPassword: "12345",
};

export const shippingAddressDefaultValues: ShippingAddress = {
  fullName: "",
  streetAddress: "",
  city: "",
  postalCode: "",
  country: "",
};

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
  ? process.env.PAYMENT_METHODS.split(",")
  : ["Paypal", "CashOnDelivery", "Stripe"];
export const DEFAULT_PAYMENT_METHOD =
  process.env.DEFAULT_PAYMENT_METHOD || "Paypal";

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 5;

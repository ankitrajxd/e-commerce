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
  : ["Online", "CashOnDelivery"];
export const DEFAULT_PAYMENT_METHOD =
  process.env.DEFAULT_PAYMENT_METHOD || "Online";

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 3;

export const productDefaultValues = {
  name: "",
  slug: "",
  category: "",
  images: [],
  brand: "",
  description: "",
  price: "0",
  stock: 0,
  rating: 0,
  numReviews: 0,
  isFeatured: false,
  banner: null,
};

export const USER_ROLES = ["user", "admin"];

export const reviewFormDefault = {
  title: "new Review",
  description: "This is a new review",
  rating: 5,
};

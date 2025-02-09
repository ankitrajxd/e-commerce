import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";
import { PAYMENT_METHODS } from "./constants";

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    "Price must be a valid number with two decimal places"
  );

// schema for inserting products
export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  category: z.string().min(3, "Categories must be at least 3 characters"),
  brand: z.string().min(3, " Brand be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, "Product must have at least one image"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
});

// schema for signing users in
export const signInFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// schema for signing users up
export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// cartItem schema
export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product is required."),
  name: z.string().min(1, "Product name is required."),
  slug: z.string().min(1, "Product slug is required."),
  qty: z.number().int().nonnegative("Quantity must be a positive number"),
  image: z.string().min(1, "Product image is required."),
  price: currency,
});

//cart schema
export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, "Session cart id is required."),
  userId: z.string().optional().nullable(),
});

// schema for shipping address
export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  streetAddress: z
    .string()
    .min(3, "Street address must be at least 3 characters"),
  city: z.string().min(3, "City must be at least 3 characters"),
  postalCode: z.string().min(3, "Postal code must be at least 3 characters"),
  country: z.string().min(3, "Country must be at least 3 characters"),
  lat: z.number().optional().nullable(),
  lng: z.number().optional().nullable(),
});

// schema for payment method
export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, "Payment type is required."),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    message: "Invalid payment method",
  }); // this allows only the payment methods allowed in the constant

// schema for insert order

export const insertOrderSchema = z.object({
  userId: z.string().min(1, "User id is required."),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
    message: "Invalid payment method",
  }),
  shippingAddress: shippingAddressSchema,
});

// schema for inserting an order item
export const insertOrderItemSchema = z.object({
  productId: z.string().min(1, "Product id is required."),
  slug: z.string().min(1, "Product slug is required."),
  image: z.string().min(1, "Product image is required."),
  name: z.string().min(1, "Product name is required."),
  price: currency,
  qty: z.number().int().nonnegative("Quantity must be a positive number"),
});

export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
});

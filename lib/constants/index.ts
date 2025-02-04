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

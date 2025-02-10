"use server";

import { auth, signIn, signOut } from "@/auth";
import {
  paymentMethodSchema,
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
} from "../validators";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { formatError, sendResponse } from "../utils";
import { ShippingAddress } from "@/types";
import { z } from "zod";

// sign in users with credentials
export async function signInWithCredentials(
  prevState: unknown,
  formdata: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: formdata.get("email"),
      password: formdata.get("password"),
    });

    await signIn("credentials", user);
    return {
      success: true,
      message: "Sign in successful",
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return {
      success: false,
      message: "Invalid email or password",
    };
  }
}

// sign out users
export async function signOutUser() {
  await signOut();
  // revalidatePath("/cart");
}

// signup users with credentials
export async function signUpWithCredentials(
  prevState: unknown,
  formdata: FormData
) {
  try {
    const user = signUpFormSchema.parse({
      name: formdata.get("name"),
      email: formdata.get("email"),
      password: formdata.get("password"),
      confirmPassword: formdata.get("confirmPassword"),
    });

    const hashedPassword = hashSync(user.password, 10);
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
      },
    });

    await signIn("credentials", {
      email: user.email,
      password: user.password,
    });

    return {
      success: true,
      message: "User registered successfully.",
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return sendResponse(false, formatError(error));
  }
}

// get user by the ID
export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }
  return user;
}

// update user's address // the reason why we are using sesion here to access the user id is because we know that session is saved on server and jwt/token is saved on client side

export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });

    if (!currentUser) {
      throw new Error("User not found");
    }

    const address = shippingAddressSchema.parse(data);

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        address,
      },
    });

    return sendResponse(true, "Address updated successfully");
  } catch (error) {
    return sendResponse(false, formatError(error));
  }
}

// update user's payment method
export async function updateUserPaymentMethod(
  data: z.infer<typeof paymentMethodSchema>
) {
  try {
    // get the session
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });

    if (!currentUser) {
      throw new Error("User not found");
    }

    const paymentMethod = paymentMethodSchema.parse(data);
    if (!paymentMethod) {
      throw new Error("Invalid payment method");
    }

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        paymentMethod: paymentMethod.type,
      },
    });

    return sendResponse(true, "Payment method updated successfully");
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// update the user profile
export async function updateProfile(user: { name: string; email: string }) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });

    if (!currentUser) {
      throw new Error("User not found");
    }

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name: user.name,
      },
    });

    return {
      success: true,
      message: "Profile updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

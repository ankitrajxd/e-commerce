"use server";

import { auth, signIn, signOut } from "@/auth";
import {
  paymentMethodSchema,
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
  userUpdateSchema,
} from "../validators";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { formatError, sendResponse } from "../utils";
import { ShippingAddress } from "@/types";
import { z } from "zod";
import { PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";

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

    // find if the user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        email: user.email,
      },
    });

    if (existingUser) {
      return {
        success: false,
        message: "User already exists",
      };
    }

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
    return {
      success: false,
      message: formatError(error),
    };
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

    return {
      success: true,
      message: "Address updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
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

// get alll users
export async function getAllUsers({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const users = await prisma.user.findMany({
    take: limit,
    skip: (page - 1) * limit,
    orderBy: {
      createdAt: "desc",
    },

    omit: {
      password: true,
    },
  });

  const dataCount = await prisma.user.count();

  return {
    data: users,
    totalPage: Math.ceil(dataCount / limit),
  };
}

// delete a user by id
export async function deleteUserById(userId: string) {
  try {
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    revalidatePath("/admin/users");

    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// update a user
export async function updateUser(user: z.infer<typeof userUpdateSchema>) {
  try {
    //  validate the user
    const updatedUser = userUpdateSchema.parse(user);

    if (!updatedUser) {
      throw new Error("Invalid user data");
    }

    // find the user
    const existingUser = await prisma.user.findFirst({
      where: {
        id: user.id,
      },
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    // update

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: updatedUser.name,
        role: updatedUser.role,
      },
    });

    revalidatePath("/admin/users");

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

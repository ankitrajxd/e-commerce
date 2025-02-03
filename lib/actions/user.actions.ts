"use server";

import { signIn, signOut } from "@/auth";
import { signInFormSchema, signUpFormSchema } from "../validators";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";

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
    return {
      success: false,
      message: "User was not registered.",
    };
  }
}

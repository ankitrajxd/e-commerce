import NextAuth from "next-auth";
import { authconfig } from "./auth.config";

export const { auth: middleware } = NextAuth(authconfig);

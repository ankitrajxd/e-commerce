/* eslint-disable @typescript-eslint/no-explicit-any */

import NextAuth, { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import { NextResponse } from "next/server";
import Google from "next-auth/providers/google";
import { authconfig } from "./auth.config";

export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },

  trustHost: true,

  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },

      async authorize(credentials) {
        if (credentials == null) {
          return null;
        }

        // find user in db
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        // check if user exists and if the password matches
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );
          // if password is correct return user
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }

        // if user does not exist or password does not match return null
        return null;
      },
    }),
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  callbacks: {
    ...authconfig.callbacks,

    async jwt({ token, user, trigger, session }: any) {
      // assign user fields to token
      if (user) {
        token.role = user.role;
        token.id = user.id;
        // if users has no name then use the email to extract the name
        if (user.name === "NO_NAME") {
          token.name = user.email.split("@")[0];

          // update the db to reflect the new name
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }
      }

      // if there is an update, set the user name
      if (session?.user.name && trigger === "update") {
        token.name = session.user.name;
      }

      return token;
    },
    async session({ session, user, trigger, token }: any) {
      // set the user id from the token(that {} (object which contains user) is received from authorize callback above)
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;

      // if there is an update, set the user name
      if (trigger === "update") {
        session.user.name = user.name;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { auth, handlers, signIn, signOut } = NextAuth(config);

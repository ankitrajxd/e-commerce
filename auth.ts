/* eslint-disable @typescript-eslint/no-explicit-any */

import NextAuth, { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextResponse } from "next/server";
import Google from "next-auth/providers/google";
import { compare } from "./lib/encrypt";

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
          const isMatch = await compare(
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

    async authorized({ request, auth }: any) {
      // array of regex pattern of paths we want to pretect
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ];

      // get pathname from the req url object
      const { pathname } = request.nextUrl;
      // check if user is not authenticated and accessing a protected path.
      if (!auth && protectedPaths.some((path) => path.test(pathname))) {
        return false;
      }

      // check for session cart cookie
      if (!request.cookies.get("sessionCartId")) {
        // if no session cart id, generate one using crypto
        const sessionCartId = crypto.randomUUID();

        // clone the req headers
        const newRequestHeaders = new Headers(request.headers);

        // create new response and add the new headers
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });

        // generate a cookie and set newly generate sessionCartId in the resoponse
        response.cookies.set("sessionCartId", sessionCartId);
        return response;
      } else {
        return true;
      }
    },
  },
} satisfies NextAuthConfig;

export const { auth, handlers, signIn, signOut } = NextAuth(config);

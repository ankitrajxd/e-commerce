/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

export const authconfig = {
  providers: [],

  callbacks: {
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

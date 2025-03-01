import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "@/assets/styles/globals.css";
import { APP_NAME, APP_DESCRIPTION, SERVER_URL } from "@/lib/constants";
import { ThemeProvider } from "@/components/shared/header/theme-provider";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/toaster";

const poppins = DM_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: `%s | Ecommerce`,
    default: APP_NAME!,
  },
  description: `${APP_DESCRIPTION}`,
  metadataBase: new URL(SERVER_URL),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader color="yellow" />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

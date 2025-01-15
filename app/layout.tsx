import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ReactNode } from "react";
import { ThemeProvider } from "@/shared/components/theme-provider";
import { QueryClientProviderWrapper } from "../shared/lib/use-query/query-client-provider-wrapper";
import { Toaster } from "@/shared/components/ui/sonner";

export const metadata: Metadata = {
  title: "GenTrade",
  description: "Instantly generate cryptotrading bots",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <ClerkProvider dynamic appearance={{ baseTheme: dark }}>
      <html lang="en" suppressHydrationWarning>
        <body className="antialiased bg-sidebar overflow-hidden">
          <ThemeProvider attribute="class" defaultTheme="system">
            {/* <div className="flex flex-col items-center h-dvh bg-background w-full"> */}
            {/* <Header /> */}
            <QueryClientProviderWrapper>
              {props.children}
            </QueryClientProviderWrapper>
            {/* {props.children} */}
            {/* </div> */}
          </ThemeProvider>
          <Toaster position="top-center" closeButton />
        </body>
      </html>
    </ClerkProvider>
  );
}

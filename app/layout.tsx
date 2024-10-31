import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ReactNode } from "react";
import { ThemeProvider } from "@/shared/components/theme-provider";
import { QueryClientProviderWrapper } from "../shared/lib/use-query/query-client-provider-wrapper";

export const metadata: Metadata = {
  title: "GenTrade",
  description: "Instantly generate cryptotrading bots",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased bg-sidebar">
          <ThemeProvider attribute="class" defaultTheme="system">
            {/* <div className="flex flex-col items-center h-dvh bg-background w-full"> */}
            {/* <Header /> */}
            <QueryClientProviderWrapper>
              {props.children}
            </QueryClientProviderWrapper>
            {/* {props.children} */}
            {/* </div> */}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

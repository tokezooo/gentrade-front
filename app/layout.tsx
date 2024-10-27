import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/custom/header";

export const metadata: Metadata = {
  title: "GenTrade",
  description: "Instantly generate cryptotrading bots",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en">
        <body className="antialiased bg-sidebar">
          <ThemeProvider attribute="class" defaultTheme="system">
            {/* <div className="flex flex-col items-center h-dvh bg-background w-full"> */}
            {/* <Header /> */}
            {props.children}
            {/* </div> */}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

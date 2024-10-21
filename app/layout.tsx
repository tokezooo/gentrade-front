import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { EndpointsContext } from "./agent";
import { ReactNode } from "react";
import Header from "@/components/prebuilt/header";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "GenTrade",
  description: "Instantly generate cryptotrading bots",
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <ThemeProvider attribute="class" defaultTheme="system">
            <div className="flex flex-col p-4 md:p-8 h-[100vh]">
              <EndpointsContext>
                <Header />
                {props.children}
              </EndpointsContext>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

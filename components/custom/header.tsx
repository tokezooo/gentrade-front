"use client";

import React from "react";
import { SignedOut, SignedIn, SignInButton, UserButton } from "@clerk/nextjs";
import { ThemeSwitcher } from "../theme-switcher";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const { theme } = useTheme();
  const clerkTheme = theme === "dark" ? dark : undefined;
  const pathname = usePathname();
  return (
    <header className="flex flex-row p-6 w-full justify-between items-center">
      <Link href="/" className="text-2xl font-bold">
        GenTrade
      </Link>
      <div className="flex flex-row gap-3 items-center">
        <ThemeSwitcher />
        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded text-sm">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          {!pathname.includes("/chat") && (
            <Link href="/chat" className="text-primary hover:underline mr-4">
              Chat
            </Link>
          )}
          <UserButton appearance={{ baseTheme: clerkTheme }} />
        </SignedIn>
      </div>
    </header>
  );
};

export default Header;

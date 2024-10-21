"use client";

import React from "react";
import { SignedOut, SignedIn, SignInButton, UserButton } from "@clerk/nextjs";
import { ThemeSwitcher } from "../theme-switcher";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

const header = () => {
  const { theme, setTheme } = useTheme();
  const clerkTheme = theme === "dark" ? dark : undefined;

  return (
    <header>
      <div className="flex flex-row justify-between items-center pb-5">
        <div className="flex-grow text-center">
          <p className="text-[28px] font-medium text-gray-500">GenTrade</p>
        </div>
        <div className="flex flex-row gap-2">
          <ThemeSwitcher />
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton appearance={{ baseTheme: clerkTheme }} />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default header;

"use client";

import { SignIn } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

export default function SignInPage() {
  const { theme, setTheme } = useTheme();
  const clerkTheme = theme === "dark" ? dark : undefined;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn appearance={{ baseTheme: clerkTheme }} />
    </div>
  );
}

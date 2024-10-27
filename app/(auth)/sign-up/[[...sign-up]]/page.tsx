"use client";

import { SignUp } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

export default function SignUpPage() {
  const { theme, setTheme } = useTheme();
  const clerkTheme = theme === "dark" ? dark : undefined;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp appearance={{ baseTheme: clerkTheme }} />
    </div>
  );
}

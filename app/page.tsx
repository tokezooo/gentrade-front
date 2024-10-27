import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { currentUser, auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function HomePage() {
  const { userId } = auth();
  const user = await currentUser();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to GenTrade</h1>
      <p className="text-xl mb-8 max-w-2xl">
        GenTrade is a revolutionary platform for generating and testing crypto
        trading bots. Create your own trading bot army within a friendly chat
        interface.
      </p>
      {userId ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg">Welcome back, {user?.firstName}!</p>
          <Link href="/chat">
            <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded">
              Go to Chat
            </button>
          </Link>
        </div>
      ) : (
        <div className="flex gap-4">
          <SignInButton mode="modal">
            <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded">
              Sign Up
            </button>
          </SignUpButton>
        </div>
      )}
    </div>
  );
}

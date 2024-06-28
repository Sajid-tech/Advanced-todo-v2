"use client"
import { signInAction } from "@/actions/auth-action";
import { Button } from "@/components/ui/button";
import { useSession, signIn, signOut } from "next-auth/react"
import Image from "next/image";

export default function Home() {



  const handleSignIn = async () => {
    await signInAction();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Todovex main page </h1>

      <Button onClick={handleSignIn} >Sign in loggedin </Button>

    </main>
  );
}





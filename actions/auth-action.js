"use client";

import { signIn, signOut } from "next-auth/react";



export async function signInAction() {
    await signIn("google", { callbackUrl: "/loggedin" });
}

export async function signOutAction() {
    await signOut({ callbackUrl: "/" });
}
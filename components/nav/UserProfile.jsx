"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { signOutAction } from "@/actions/auth-action";
const UserProfile = () => {
  const { data: session } = useSession();

  console.log("user profile session", session);

  const imageUrl = session?.user?.image;
  const name = session?.user?.name;
  const email = session?.user?.email;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="hover:cursor-pointer">
        <Button
          variant={"secondary"}
          className="flex items-center justify-start gap-1 lg:gap-2 m-0 p-0 lg:px-3 lg:w-full bg-white"
        >
          {imageUrl && (
            <Image
              src={imageUrl}
              width={24}
              height={24}
              alt={`${name} profile picture`}
              className="rounded-full"
            />
          )}
          <p className="truncate">{email}</p>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem className="lg:w-full px-28 flex items-center justify-center">
          <form action={signOutAction}>
            <Button
              type="submit"
              variant={"ghost"}
              className="hover:text-primary"
            >
              Sign out
            </Button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;

"use client";

import { signInAction } from "@/actions/auth-action";
import { Button } from "@/components/ui/button";
import todovexLogo from "@/public/logo/todovex.svg";
import clsx from "clsx";
import { Loader, StepForward } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

export default function LoginForm() {
  const [pending, setPending] = useState(false);

  const handleSignIn = async (event) => {
    event.preventDefault();
    setPending(true);
    try {
      await signInAction();
    } catch (error) {
      console.error("Sign-in failed:", error);
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="bg-gradient-to-r from-purple-200 to-orange-200 h-full min-h-screen">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="container relative m-0 mx-auto py-10 md:px-10"
      >
        <div className="max-width flex items-center justify-center lg:justify-between">
          <Link className="flex items-center gap-1" href="/">
            <motion.div
              initial={{ x: -100 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={todovexLogo}
                width="50"
                height="50"
                alt="logo"
                className="h-16 w-20 md:h-16 md:w-20"
              />
            </motion.div>
            <motion.h1
              initial={{ x: -100 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xl hidden lg:flex font-medium text-gray-950 md:text-3xl"
            >
              TodoVex
            </motion.h1>
          </Link>
          <div className="hidden lg:flex w-fit items-center">
            <form onSubmit={handleSignIn}>
              <GoogleSignInButton pending={pending} />
            </form>
          </div>
        </div>
        <div className="w-full px-4 pt-12 md:px-4 lg:px-8 xl:px-10 2xl:px-0">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex h-full w-full flex-col items-center justify-center"
          >
            <span
              rel="noreferrer"
              className="mb-6 cursor-pointer rounded-2xl border border-black px-4 py-1 text-xs text-slate-600 transition duration-300 ease-in-out hover:text-slate-700 sm:text-base text-center"
            >
              Powered by{" "}
              <a
                className="font-bold"
                target="_blank"
                href="https://convex.dev/c/todovex"
              >
                Mongodb{" "}
              </a>
              and{" "}
              <a
                className="font-bold"
                target="_blank"
                href="https://www.openai.com/"
              >
                Auth ✨
              </a>
            </span>
            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block text-center text-4xl font-medium tracking-tighter text-dark lg:text-7xl"
            >
              A task management{" "}
              <br className="hidden lg:inline-block" />
              & sharing tool
            </motion.h1>
            <motion.h2
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-8 text-center text-xl font-light tracking-tight lg:text-3xl"
            >
              TodoVex seamlessly{" "}
              <span className="font-bold px-1">organizes your tasks</span> and
              <br className="hidden lg:inline-block" />
              <span className="font-bold px-1">shares tasks with others</span>

            </motion.h2>
            <div className="mt-12 flex flex-col gap-4">
              <form onSubmit={handleSignIn}>
                <GetStartedButton pending={pending} />
              </form>
              <div className="w-fit items-center">
                <Button
                  className="text-xl text-center px-4 py-7 bg-transparent border-purple-500/50"
                  variant={"outline"}
                  href="https://github.com/Sajid-tech/Advanced-todo-v2"
                >
                  Star on Github ⭐️
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}

function GetStartedButton({ pending }) {
  return (
    <motion.button
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
      disabled={pending}
      type="submit"
      className="flex items-center justify-center px-8 py-4 mb-2 me-2 overflow-hidden text-xl font-medium text-gray-100 rounded-xl group bg-gradient-to-br from-purple-600 to-orange-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-yellow-300 dark:focus:ring-blue-800"
    >
      <span className="flex items-center gap-1">
        {pending ? (
          <span className="px-16">
            <Loader className="w-5 h-5" />
          </span>
        ) : (
          <>
            Get Started
            <StepForward />
          </>
        )}
      </span>
    </motion.button>
  );
}

function GoogleSignInButton({ pending }) {
  return (
    <motion.button
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
      disabled={pending}
      className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
    >
      <span
        className={clsx(
          "relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0",
          pending && "px-16"
        )}
      >
        {pending ? (
          <span className="">
            <Loader className="w-5 h-5" />
          </span>
        ) : (
          "Sign in with Google"
        )}
      </span>
    </motion.button>
  );
}

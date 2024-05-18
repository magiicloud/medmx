"use client";
import React from "react";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { CustomSession } from "@/auth";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

const Login = () => {
  const { status, data: session } = useSession();
  const customSession = session as CustomSession;
  return (
    <>
      <div className="text-center space-x-10 space-y-8 mt-10">
        {status === "authenticated" && (
          <TextGenerateEffect words={`Hello, ${customSession.user!.name}.`} />
        )}
        {status === "authenticated" && (
          <Button color="primary" size="lg">
            <Link href="/api/auth/signout">Sign Out</Link>
          </Button>
        )}
        {status === "unauthenticated" && (
          <Button color="primary" size="lg">
            <Link href="/api/auth/signin">Sign In</Link>
          </Button>
        )}
      </div>
    </>
  );
};

export default Login;

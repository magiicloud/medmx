"use client";
import React from "react";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { CustomSession } from "@/auth";

const Login = () => {
  const { status, data: session } = useSession();
  const customSession = session as CustomSession | null;
  return (
    <>
      <div className="text-center space-x-10 mt-10">
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

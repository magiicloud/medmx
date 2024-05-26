import React from "react";
import Link from "next/link";
import { auth } from "@/auth";

const Login = async () => {
  const session = await auth();

  return (
    <>
      <div className="text-center space-y-8 mt-10 ">
        {!session && (
          <button className="p-[3px] relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#ff9ff3] via-[#ff6b6b] to-[#1dd1a1] rounded-lg" />
            <div className="px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
              <Link href="/api/auth/signin">Sign In</Link>
            </div>
          </button>
        )}
      </div>
    </>
  );
};

export default Login;

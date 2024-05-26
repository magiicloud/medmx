import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import prisma from "./prisma/client";
import { Provider } from "next-auth/providers";
import GitHub from "next-auth/providers/github";

const providers: Provider[] = [Google, GitHub];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt(params) {
      const { token, user } = params;
      if (user) {
        // user just logged in
        const dbUser = await prisma.user.upsert({
          where: { email: user.email ?? "" },
          update: { email: user.email ?? "" },
          create: { email: user.email ?? "" },
        });
        token.userId = dbUser.id; // Save the user id (cuid) from the DB in the token
      }
      return token;
    },
    async session(params) {
      const { session, token } = params;
      session.user.id = token.userId as string;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});

export const providerMap = providers.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name };
  } else {
    return { id: provider.id, name: provider.name };
  }
});

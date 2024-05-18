import NextAuth, { Session } from "next-auth";
import Google from "next-auth/providers/google";
import prisma from "./prisma/client";

export interface CustomSession extends Session {
  userId: string;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async jwt(params) {
      const { token, user } = params;
      if (user) {
        // user just logged in
        const dbUser = await prisma.user.upsert({
          where: { email: user.email ?? "" }, // Ensure user.email is not null
          update: { email: user.email ?? "" }, // Ensure user.email is not null
          create: { email: user.email ?? "" }, // Ensure user.email is not null
        });
        token.userId = dbUser.id;
      }
      return token;
    },
    async session(params) {
      const { session, token } = params;
      session.userId = token.userId as string;
      return session as CustomSession;
    },
  },
  session: {
    strategy: "jwt",
  },
});

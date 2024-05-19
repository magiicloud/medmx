import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import prisma from "./prisma/client";

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

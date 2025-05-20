import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [],
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub as string;
        session.user.type = token.type as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.type = user.type;
      }
      return token;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  }
}; 
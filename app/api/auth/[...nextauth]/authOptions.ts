import { AuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      type: string;
      name?: string | null;
      email?: string | null;
    }
  }
  interface User {
    type: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    type?: string;
  }
}

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
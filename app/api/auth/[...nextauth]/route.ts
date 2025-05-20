import NextAuth from "next-auth";
import { authOptions } from "../authOptions";

// Type augmentations (if needed)
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
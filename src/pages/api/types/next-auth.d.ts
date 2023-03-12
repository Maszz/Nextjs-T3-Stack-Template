import { type DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      userId: string;
      username: string;
    } & DefaultSession['user'];
  }
  interface User extends DefaultUser {
    username: string;
    credType: string;
    provider: string;
  }
}
declare module 'next-auth/jwt' {
  interface JWT {
    userId: string;
    username: string;
  }
}

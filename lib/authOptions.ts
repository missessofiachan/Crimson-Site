import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import clientPromise from '@/lib/mongodb';
import type { NextAuthOptions } from 'next-auth';

// Exports  authOptions for reuse across the application
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        const user = await db.collection('users').findOne({ email: credentials.email });

        if (!user || !user.password) {
          throw new Error('Email does not exist');
        }

        const isCorrectPassword = await compare(credentials.password, user.password);

        if (!isCorrectPassword) {
          throw new Error('Invalid password');
        }

        return {
          id: user._id.toString(),
          name: user.name || user.email,
          email: user.email,
          role: user.role || 'user',
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub || '';
        session.user.role = token.role || 'user';
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || 'user';
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt' as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

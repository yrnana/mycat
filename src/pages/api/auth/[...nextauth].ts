import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth from 'next-auth';
import KakaoProvider from 'next-auth/providers/kakao';
import { prisma } from '~/helpers/prisma';

export default NextAuth({
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      authorization: {
        url: 'https://kauth.kakao.com/oauth/authorize',
        params: {
          scope: undefined,
        },
      },
      token: {
        url: 'https://kauth.kakao.com/oauth/token',
        request: async ({ provider, params, checks, client }) => {
          const exchangeBody = {
            client_id: provider.clientId,
            client_secret: provider.clientSecret,
          };
          return {
            tokens: await client.oauthCallback(
              provider.callbackUrl,
              params,
              checks,
              { exchangeBody },
            ),
          };
        },
      },
      checks: ['state'],
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    secret: process.env.SECRET,
  },
  pages: {
    signIn: '/auth/signin',
    // error: '/auth/error', // Error code passed in query string as ?error=
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.isAdmin = !!user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      session.isAdmin = token.isAdmin;
      return session;
    },
  },
});

import NextAuth, { DefaultSession } from 'next-auth';
import authConfig from '@/auth.config';
import { db } from '@/lib/db';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { getUserById } from './data/user';
import { getTwoFactorConfirmationByUserId } from './data/two-factor-confirmation';
import { getAccountByUserId } from './data/account';
import { UserRole } from '@prisma/client';

declare module '@auth/core' {
	interface Session {
		user: {
			role: string;
		} & DefaultSession['user'];
	}
}

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth({
	pages: {
		signIn: '/auth/login',
		error: '/auth/error',
	},
	events: {
		async linkAccount({ user }) {
			await db.user.update({
				where: { id: user.id },
				data: { emailVerified: new Date() },
			});
		},
	},
	callbacks: {
		async signIn({ user, account }) {
			// Allow OAuth without email verification
			if (account?.provider !== 'credentials') return true;

			const existingUser = await getUserById(user.id as string);

			// prevent sign in without email verification
			if (!existingUser?.emailVerified) return false;

			// two-factor authentication
			if (existingUser.isTwoFactorEnabled) {
				const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
					existingUser.id
				);

				if (!twoFactorConfirmation) return false;

				// delete two factor confirmation for next sign in
				await db.twoFactorConfirmation.delete({
					where: { id: twoFactorConfirmation.id },
				});
			}

			return true;
		},
		async session({ session, token }) {
			if (token.sub && session.user) session.user.id = token.sub;

			if (token.role && session.user) session.user.role = token.role;

			if (session.user) {
				session.user.name = token.name;
				session.user.email = token.email as string;
				session.user.role = token.role as UserRole;
				session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
				session.user.isOAuth = token.isOAuth as boolean;
			}

			return session;
		},
		async jwt({ token }) {
			if (!token.sub) return token;

			const existingUser = await getUserById(token.sub);

			if (!existingUser) return token;

			const existingAccount = await getAccountByUserId(existingUser.id);

			token.name = existingUser.name;
			token.email = existingUser.email;
			token.role = existingUser.role;
			token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
			token.isOAuth = !!existingAccount;

			return token;
		},
	},
	adapter: PrismaAdapter(db),
	session: { strategy: 'jwt' },
	secret: process.env.AUTH_SECRET,
	debug: process.env.NODE_ENV !== 'production',
	...authConfig,
});

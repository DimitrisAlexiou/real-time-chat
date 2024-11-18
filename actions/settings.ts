'use server';

import * as z from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { generateVerificationToken } from '@/lib/token';
import { sendVerificationEmail } from '@/lib/mail';
import { getUserByEmail, getUserById } from '@/data/user';
import { SettingsSchema } from '@/schemas';
import { NextResponse } from 'next/server';

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
	try {
		const user = await currentUser();

		if (!user?.id) return { error: 'Unauthorized', status: 401 };

		const dbUser = await getUserById(user.id as string);

		if (!dbUser?.id) return { error: 'Unauthorized', status: 401 };

		if (user.isOAuth) {
			values.email = undefined;
			values.password = undefined;
			values.newPassword = undefined;
			values.isTwoFactorEnabled = undefined;
		}

		if (values.email && values.email !== user.email) {
			const existingUser = await getUserByEmail(values.email);

			if (existingUser && existingUser.id !== user.id)
				return { error: 'Email already in use!', status: 400 };

			const verificationToken = await generateVerificationToken(values.email);

			await sendVerificationEmail(
				verificationToken.email,
				verificationToken.token
			);

			return { error: 'Verification email sent!', status: 200 };
		}

		if (values.password && values.newPassword && dbUser.password) {
			const passwordsMatch = await bcrypt.compare(
				values.password,
				dbUser.password
			);

			if (!passwordsMatch)
				return { error: 'Password is incorrect!', status: 400 };

			const hashedPassword = await bcrypt.hash(values.newPassword, 12);
			values.password = hashedPassword;
			values.newPassword = undefined;
		}

		const updatedUser = await db.user.update({
			where: { id: dbUser.id },
			data: {
				...values,
			},
		});

		return { updatedUser, status: 200 };
	} catch (error: any) {
		console.error(error, 'ERROR SETTINGS');
		return { error: 'Internal Server Error.', status: 500 };
	}
};

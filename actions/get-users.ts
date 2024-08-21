'use server';

import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export const getUsers = async () => {
	const user = await currentUser();

	if (!user?.email) return [];

	try {
		const users = await db.user.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			where: {
				email: {
					not: user.email,
				},
			},
		});

		return users;
	} catch (error) {
		return [];
	}
};

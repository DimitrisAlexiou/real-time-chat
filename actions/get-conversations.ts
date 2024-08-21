'use server';

import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';

export const getConversations = async () => {
	const user = await currentUser();

	if (!user?.id) return [];

	try {
		const conversations = await db.conversation.findMany({
			orderBy: {
				lastMessageAt: 'desc',
			},
			where: {
				userIds: {
					has: user.id,
				},
			},
			include: {
				users: true,
				messages: {
					include: {
						sender: true,
						seen: true,
					},
				},
			},
		});

		return conversations;
	} catch (error: any) {
		return [];
	}
};

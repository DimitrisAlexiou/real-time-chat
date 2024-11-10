import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export const getConversationById = async (conversationId: string) => {
	try {
		const user = await currentUser();

		if (!user?.email) return null;

		const conversation = await db.conversation.findUnique({
			where: {
				id: conversationId,
			},
			include: {
				users: true,
			},
		});

		return conversation;
	} catch (error: any) {
		return null;
	}
};

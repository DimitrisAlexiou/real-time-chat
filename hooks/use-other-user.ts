import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { ExtendedUser } from '@/next-auth';
import { ExtendedConversation } from '@/types/conversation';

export const useOtherUser = (
	conversation: ExtendedConversation | { users: ExtendedUser[] }
) => {
	const session = useSession();

	const otherUser = useMemo(() => {
		const currentUserEmail = session?.data?.user?.email;

		const otherUser = conversation.users.filter(
			(user) => user.email !== currentUserEmail
		);

		return otherUser[0];
	}, [conversation.users, session?.data?.user?.email]);

	return otherUser;
};

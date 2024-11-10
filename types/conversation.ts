import { ExtendedUser } from '@/next-auth';
import { Conversation, Message } from '@prisma/client';

export type ExtendedMessage = Message & {
	sender: ExtendedUser;
	seen: ExtendedUser[];
};

export type ExtendedConversation = Conversation & {
	users: ExtendedUser[];
	messages: ExtendedMessage[];
};

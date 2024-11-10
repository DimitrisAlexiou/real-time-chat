import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

interface Iparams {
	conversationId?: string;
}

export async function POST(request: Request, { params }: { params: Iparams }) {
	try {
		const user = await currentUser();
		const { conversationId } = params;

		if (!user?.id || !user?.email)
			return new NextResponse('Unauthorized', { status: 401 });

		const conversation = await db.conversation.findUnique({
			where: {
				id: conversationId,
			},
			include: {
				messages: {
					include: {
						seen: true,
					},
				},
				users: true,
			},
		});

		if (!conversation) return new NextResponse('Not Found', { status: 404 });

		const lastMessage = conversation.messages[conversation.messages.length - 1];

		if (!lastMessage) return NextResponse.json(conversation);

		const updatedMessage = await db.message.update({
			where: {
				id: lastMessage.id,
			},
			data: {
				seen: {
					connect: {
						id: user.id,
					},
				},
			},
			include: {
				sender: true,
				seen: true,
			},
		});

		return NextResponse.json(updatedMessage);
	} catch (error: any) {
		console.log(error, 'Error messages seen');
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}

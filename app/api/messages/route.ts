import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		const user = await currentUser();
		const body = await request.json();

		const { message, image, conversationId } = body;

		if (!user?.id || !user?.email)
			return new NextResponse('Unauthorized', { status: 401 });

		const newMessage = await db.message.create({
			data: {
				body: message,
				image: image,
				conversation: {
					connect: {
						id: conversationId,
					},
				},
				sender: {
					connect: {
						id: user.id,
					},
				},
				seen: {
					connect: {
						id: user.id,
					},
				},
			},
			include: {
				seen: true,
				sender: true,
			},
		});

		const updatedConversation = await db.conversation.update({
			where: {
				id: conversationId,
			},
			data: {
				lastMessageAt: new Date(),
				messages: {
					connect: {
						id: newMessage.id,
					},
				},
			},
			include: {
				users: true,
				messages: {
					include: {
						seen: true,
					},
				},
			},
		});

		return NextResponse.json(newMessage, { status: 201 });
	} catch (error: any) {
		console.error('Error in POST /api/messages: ', error);
		return new NextResponse('Internal Error', { status: 500 });
	}
}

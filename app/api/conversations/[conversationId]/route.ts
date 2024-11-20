import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { pusherServer } from '@/lib/pusher';
import { db } from '@/lib/db';

interface IParams {
	conversationId?: string;
}

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<IParams> }
) {
	try {
		const { conversationId } = await params;
		const user = await currentUser();

		if (!user?.id) return new NextResponse('Unauthorized', { status: 401 });

		const existingConversation = await db.conversation.findUnique({
			where: {
				id: conversationId,
			},
			include: {
				users: true,
			},
		});

		if (!existingConversation)
			return new NextResponse('Invalid ID', { status: 401 });

		const deletedConversation = await db.conversation.deleteMany({
			where: {
				id: conversationId,
				userIds: {
					hasSome: [user.id],
				},
			},
		});

		existingConversation.users.map((user) => {
			if (user.email)
				pusherServer.trigger(
					user.email,
					'conversation:remove',
					existingConversation
				);
		});

		return NextResponse.json(deletedConversation, { status: 200 });
	} catch (error: any) {
		console.error(
			'Error in DELETE /api/conversations/:conversationId: ',
			error
		);
		return new NextResponse('Internal Error', { status: 500 });
	}
}

import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

interface IParams {
	conversationId?: string;
}

export async function DELETE(
	request: Request,
	{ params }: { params: IParams }
) {
	try {
		const { conversationId } = params;
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

		return NextResponse.json(deletedConversation, { status: 200 });
	} catch (error: any) {
		console.error(
			'Error in DELETE /api/conversations/:conversationId: ',
			error
		);
		return new NextResponse('Internal Error', { status: 500 });
	}
}

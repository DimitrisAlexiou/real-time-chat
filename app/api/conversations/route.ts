import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { pusherServer } from '@/lib/pusher';

export async function POST(request: Request) {
	try {
		const user = await currentUser();

		const body = await request.json();
		const { userId, isGroup, members, name } = body;

		if (!user?.id || !user?.email)
			return new NextResponse('Unauthorized', { status: 401 });

		if (isGroup && (!members || members.length < 2 || !name))
			return new NextResponse('Invalid data', { status: 400 });

		if (isGroup) {
			const newConversation = await db.conversation.create({
				data: {
					name,
					isGroup,
					users: {
						connect: [
							...members.map((member: string) => ({
								id: member,
							})),
							{
								id: user.id,
							},
						],
					},
				},
				include: {
					users: true,
				},
			});

			newConversation.users.forEach((user) => {
				if (user.email)
					pusherServer.trigger(user.email, 'conversation:new', newConversation);
			});

			return NextResponse.json(newConversation, { status: 201 });
		}

		const existingConversations = await db.conversation.findMany({
			where: {
				OR: [
					{
						userIds: {
							equals: [user.id, userId],
						},
					},
					{
						userIds: {
							equals: [userId, user.id],
						},
					},
				],
			},
		});

		const singleConversation = existingConversations[0];

		if (singleConversation)
			return NextResponse.json(singleConversation, { status: 200 });

		const newConversation = await db.conversation.create({
			data: {
				users: {
					connect: [
						{
							id: user.id,
						},
						{
							id: userId,
						},
					],
				},
			},
			include: {
				users: true,
			},
		});

		newConversation.users.forEach((user) => {
			if (user.email)
				pusherServer.trigger(user.email, 'conversation:new', newConversation);
		});

		return NextResponse.json(newConversation, { status: 201 });
	} catch (error: any) {
		console.error('Error in POST /api/conversations: ', error);
		return new NextResponse('Internal Server Error.', { status: 500 });
	}
}

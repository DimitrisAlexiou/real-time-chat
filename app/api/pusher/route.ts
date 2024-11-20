import { NextResponse } from 'next/server';
import { pusherServer } from '@/lib/pusher';
import { auth } from '@/auth';

export async function POST(request: Request) {
	const session = await auth();

	if (!session?.user?.email)
		return new NextResponse('Unauthorized', { status: 401 });

	try {
		const contentType = request.headers.get('content-type');
		let body: Record<string, string> = {};
		if (contentType === 'application/json') {
			body = await request.json();
		} else if (contentType === 'application/x-www-form-urlencoded') {
			const formData = await request.text();
			body = Object.fromEntries(new URLSearchParams(formData));
		} else return new NextResponse('Unsupported Content-Type', { status: 415 });

		const { socket_id: socketId, channel_name: channel } = body;

		if (!socketId || !channel)
			return new NextResponse(
				'Missing required fields: socket_id or channel_name',
				{ status: 400 }
			);

		const data = { user_id: session.user.email };

		const authResponse = pusherServer.authorizeChannel(socketId, channel, data);
		return NextResponse.json(authResponse);
	} catch (error) {
		console.error('Pusher authorization error: ', error);
		return new NextResponse('Pusher authorization failed', { status: 500 });
	}
}

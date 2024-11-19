import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: Request) {
	try {
		const user = await currentUser();
		const body = await req.json();
		const { name, image } = body;

		if (!user?.id) return new NextResponse('Unauthorized', { status: 401 });

		const updatedUser = await db.user.update({
			where: { id: user.id },
			data: {
				name: name,
				image: image,
			},
		});

		return NextResponse.json(updatedUser, { status: 200 });
	} catch (error: any) {
		console.error('Error in POST /api/settings: ', error);
		return new NextResponse('Internal Server Error.', { status: 500 });
	}
}

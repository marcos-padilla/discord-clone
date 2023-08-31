import { getCurrentProfile } from '@/lib/current-profile'
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function PATCH(
	req: Request,
	{ params }: { params: { serverId: string } }
) {
	try {
		const profile = await getCurrentProfile()
		if (!profile) {
			return new NextResponse('Unauthorized', { status: 401 })
		}

		const { name, imageUrl } = await req.json()

		const server = await prisma.server.update({
			where: {
				id: params.serverId,
				profileId: profile.id,
			},
			data: {
				name,
				imageUrl,
			},
		})

		return NextResponse.json(server)
	} catch (error) {
		console.log('🚀 ~ file: route.ts:8 ~ error:', error)
		return new NextResponse('Internal Server Error', { status: 500 })
	}
}

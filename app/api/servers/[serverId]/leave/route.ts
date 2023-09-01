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
		if (!params.serverId) {
			return new NextResponse('Missing Server ID', { status: 400 })
		}
		const server = await prisma.server.update({
			where: {
				id: params.serverId,
				profileId: {
					not: profile.id,
				},
			},
			data: {
				members: {
					deleteMany: {
						profileId: profile.id,
					},
				},
			},
		})

		return NextResponse.json(server)
	} catch (error) {
		console.log(error)
		return new NextResponse('Internal Server Error', { status: 500 })
	}
}

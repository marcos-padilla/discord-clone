import { getCurrentProfile } from '@/lib/current-profile'
import prisma from '@/lib/db'
import { MemberRole } from '@prisma/client'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

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
			return new NextResponse('Server ID Missing', { status: 400 })
		}

		/* const server = await prisma.server.findUnique({
			where: {
				id: params.serverId,
				members: {
					some: {
						OR: [
							{
								profileId: profile.id,
								role: MemberRole.ADMIN,
							},
							{
								profileId: profile.id,
								role: MemberRole.MODERATOR,
							},
						],
					},
				},
			},
		})

		if (!server) {
			return new NextResponse('Unauthorized', { status: 401 })
		} */

		const newServer = await prisma.server.update({
			where: {
				id: params.serverId,
				profileId: profile.id,
			},
			data: {
				inviteCode: uuidv4(),
			},
		})
		return NextResponse.json(newServer)
	} catch (error) {
		console.log({ error })
		return new NextResponse('Internal Server Error', { status: 500 })
	}
}

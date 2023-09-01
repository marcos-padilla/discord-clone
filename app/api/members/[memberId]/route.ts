import { getCurrentProfile } from '@/lib/current-profile'
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function PATCH(
	req: Request,
	{ params }: { params: { memberId: string } }
) {
	try {
		const profile = await getCurrentProfile()
		if (!profile) {
			return new NextResponse('Unauthorized', { status: 401 })
		}
		const { searchParams } = new URL(req.url)
		const { role } = await req.json()
		const serverId = searchParams.get('serverId')
		if (!serverId) {
			return new NextResponse('Server ID missing', { status: 400 })
		}
		if (!params.memberId) {
			return new NextResponse('Member ID Missing', { status: 400 })
		}
		const server = await prisma.server.update({
			where: {
				id: serverId,
				profileId: profile.id,
			},
			data: {
				members: {
					update: {
						where: {
							id: params.memberId,
							profileId: {
								not: profile.id,
							},
						},
						data: {
							role,
						},
					},
				},
			},
			include: {
				members: {
					include: { profile: true },
					orderBy: { role: 'asc' },
				},
			},
		})

		return NextResponse.json(server)
	} catch (error) {
		console.log('🚀 ~ file: route.ts:6 ~ error:', error)
		return new NextResponse('Internal Server Error', { status: 500 })
	}
}

import { getCurrentProfile } from '@/lib/current-profile'
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { MemberRole } from '@prisma/client'

export async function POST(req: Request) {
	try {
		const profile = await getCurrentProfile()
		if (!profile) {
			return new NextResponse('Unauthorized', { status: 401 })
		}
		const { searchParams } = new URL(req.url)
		const serverId = searchParams.get('serverId')
		if (!serverId) {
			return new NextResponse('Missing Server ID', { status: 400 })
		}

		const { name, type } = await req.json()
		if (!name || !type) {
			return new NextResponse('Missing Info!!!', { status: 401 })
		}

		if (name === 'general') {
			return new NextResponse('Name cannot be `general`', {
				status: 400,
			})
		}

		const server = await prisma.server.update({
			where: {
				id: serverId,
				members: {
					some: {
						profileId: profile.id,
						role: {
							in: [MemberRole.ADMIN, MemberRole.MODERATOR],
						},
					},
				},
			},
			data: {
				channels: {
					create: {
						profileId: profile.id,
						name,
						type,
					},
				},
			},
		})
		return NextResponse.json(server)
	} catch (error) {
		console.log('🚀 ~ file: route.ts:47 ~ POST ~ error:', error)
		return new NextResponse('Internal Server Error', { status: 500 })
	}
}

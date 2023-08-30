import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { MemberRole } from '@prisma/client'
import { getCurrentProfile } from '@/lib/current-profile'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: Request) {
	try {
		const profile = await getCurrentProfile()
		if (!profile) {
			return new NextResponse('Unauthorized', { status: 401 })
		}
		const { name, imageUrl } = await req.json()
		const server = await prisma.server.create({
			data: {
				profileId: profile.id,
				name,
				imageUrl,
				inviteCode: uuidv4(),
				channels: {
					create: [{ name: 'general', profileId: profile.id }],
				},
				members: {
					create: [
						{ profileId: profile.id, role: MemberRole.ADMIN },
					],
				},
			},
		})

		return NextResponse.json(server)
	} catch (error) {
		console.log('🚀 ~ file: route.ts:6 ~ POST ~ error:', error)
		return new NextResponse('Internal Server Error', { status: 500 })
	}
}

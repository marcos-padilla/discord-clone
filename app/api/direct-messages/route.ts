import { getCurrentProfile } from '@/lib/current-profile'
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { DirectMessage } from '@prisma/client'

const MESSAGES_BATCH = 10

export async function GET(req: Request) {
	try {
		const profile = getCurrentProfile()
		if (!profile) {
			return new NextResponse('Unauthorized', { status: 401 })
		}

		const { searchParams } = new URL(req.url)

		const cursor = searchParams.get('cursor')
		const conversationId = searchParams.get('conversationId')

		if (!conversationId) {
			return new NextResponse('Conversation ID Missing', {
				status: 400,
			})
		}

		let messages: DirectMessage[] = []
		if (cursor) {
			messages = await prisma.directMessage.findMany({
				take: MESSAGES_BATCH,
				skip: 1,
				cursor: {
					id: cursor,
				},
				where: {
					conversationId,
				},
				include: {
					member: {
						include: {
							profile: true,
						},
					},
				},
				orderBy: {
					createdAt: 'desc',
				},
			})
		} else {
			messages = await prisma.directMessage.findMany({
				take: MESSAGES_BATCH,
				where: {
					conversationId,
				},
				include: {
					member: {
						include: {
							profile: true,
						},
					},
				},
				orderBy: {
					createdAt: 'desc',
				},
			})
		}

		let nextCursor = null
		if (messages.length === MESSAGES_BATCH) {
			nextCursor = messages[MESSAGES_BATCH - 1].id
		}
		return NextResponse.json({
			items: messages,
			nextCursor,
		})
	} catch (error) {
		console.log(error)
		return new NextResponse('Internal Server Errror', { status: 500 })
	}
}

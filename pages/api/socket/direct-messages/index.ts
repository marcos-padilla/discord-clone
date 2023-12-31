import { getCurrentProfilePages } from '@/lib/current-profile-pages'
import { NextApiResponseServerIO } from '@/types'
import { NextApiRequest } from 'next'
import prisma from '@/lib/db'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponseServerIO
) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' })
	}

	try {
		const profile = await getCurrentProfilePages(req)
		if (!profile) {
			return res.status(401).json({ error: 'Unauthorized' })
		}

		const { content, fileUrl } = req.body
		const { conversationId } = req.query

		if (!conversationId) {
			return res.status(400).json({ error: 'Conversation ID Missing' })
		}

		if (!content) {
			return res.status(400).json({ error: 'Content Missing' })
		}

		const conversation = await prisma.conversation.findFirst({
			where: {
				id: conversationId as string,
				OR: [
					{
						memberOne: {
							profileId: profile.id,
						},
					},
					{
						memberTwo: {
							profileId: profile.id,
						},
					},
				],
			},
			include: {
				memberOne: {
					include: {
						profile: true,
					},
				},
				memberTwo: {
					include: {
						profile: true,
					},
				},
			},
		})

		if (!conversation) {
			return res.status(404).json({ error: 'Conversation not found' })
		}

		const member =
			conversation.memberOne.profileId === profile.id
				? conversation.memberOne
				: conversation.memberTwo

		if (!member) {
			return res.status(404).json({ message: 'Member not found' })
		}

		const message = await prisma.directMessage.create({
			data: {
				content,
				fileUrl,
				conversationId: conversationId as string,
				memberId: member.id,
			},
			include: {
				member: {
					include: {
						profile: true,
					},
				},
			},
		})

		const channelKey = `chat:${conversationId}:messages`

		res?.socket?.server?.io?.emit(channelKey, message)

		return res.status(200).json(message)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: 'Internal Server Error' })
	}
}

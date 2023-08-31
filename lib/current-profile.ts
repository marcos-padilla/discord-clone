import { auth } from '@clerk/nextjs'
import prisma from './db'

export async function getCurrentProfile() {
	const { userId } = auth()
	if (!userId) return null
	const profile = await prisma.profile.findUnique({
		where: {
			userId,
		},
	})
	return profile
}
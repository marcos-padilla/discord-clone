import { getCurrentProfile } from '@/lib/current-profile'
import prisma from '@/lib/db'
import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
interface ServerIdPageProps {
	params: {
		serverId: string
	}
}
export default async function ServerIDPage({ params }: ServerIdPageProps) {
	const profile = await getCurrentProfile()
	if (!profile) {
		return redirectToSignIn()
	}

	const server = await prisma.server.findUnique({
		where: {
			id: params.serverId,
			members: {
				some: {
					profileId: profile.id,
				},
			},
		},
		include: {
			channels: {
				where: {
					name: 'general',
				},
				select: {
					name: true,
					id: true,
				},
				orderBy: {
					createdAt: 'asc',
				},
			},
		},
	})

	const initialChannel = server?.channels[0]

	if (initialChannel?.name !== 'general') {
		return null
	}

	return redirect(
		`/servers/${params.serverId}/channels/${initialChannel.id}`
	)
}

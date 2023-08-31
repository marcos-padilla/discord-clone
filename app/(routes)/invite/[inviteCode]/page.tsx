import { getCurrentProfile } from '@/lib/current-profile'
import { redirectToSignIn } from '@clerk/nextjs'
import prisma from '@/lib/db'
import { redirect } from 'next/navigation'

export default async function InviteServer({
	params,
}: {
	params: { inviteCode: string }
}) {
	const profile = await getCurrentProfile()
	if (!profile) {
		return redirectToSignIn()
	}

	if (!params.inviteCode) {
		return redirect('/')
	}

	const existingServer = await prisma.server.findFirst({
		where: {
			inviteCode: params.inviteCode,
			members: {
				some: {
					profileId: profile.id,
				},
			},
		},
	})

	if (existingServer) {
		return redirect(`/servers/${existingServer.id}`)
	}

	const server = await prisma.server.update({
		where: {
			inviteCode: params.inviteCode,
		},
		data: {
			members: {
				create: [
					{
						profileId: profile.id,
					},
				],
			},
		},
	})

	if (server) {
		return redirect(`/servers/${server.id}`)
	}

	return null
}

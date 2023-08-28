import { initialProfile } from '@/lib/initial-profile'
import prisma from '@/lib/db'
import { redirect } from 'next/navigation'
export default async function SetupPage() {
	const profile = await initialProfile()
	const server = await prisma.server.findFirst({
		where: {
			members: {
				some: {
					profileId: profile.id,
				},
			},
		},
	})

	if (server) {
		redirect(`/servers/${server.id}`)
	}
	return <div>Create a Server</div>
}

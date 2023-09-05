import { getCurrentProfile } from '@/lib/current-profile'
import { redirectToSignIn } from '@clerk/nextjs'
import prisma from '@/lib/db'
import { redirect } from 'next/navigation'
import ChatHeader from '@/components/chat/ChatHeader'
import ChatInput from '@/components/chat/ChatInput'

interface ChannelIdPageProps {
	params: {
		serverId: string
		channelId: string
	}
}

export default async function ChannelIdPage({ params }: ChannelIdPageProps) {
	const profile = await getCurrentProfile()
	if (!profile) {
		return redirectToSignIn()
	}

	const channel = await prisma.channel.findUnique({
		where: {
			id: params.channelId,
			server: {
				members: {
					some: {
						profileId: profile.id,
					},
				},
			},
		},
	})

	const member = await prisma.member.findFirst({
		where: {
			serverId: params.serverId,
			profileId: profile.id,
		},
	})

	if (!channel || !member) {
		return redirect('/')
	}
	return (
		<div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
			<ChatHeader
				name={channel.name}
				serverId={channel.serverId}
				type='channel'
			/>
			<div className='flex-1'>Future Messages</div>
			<ChatInput
				name={channel.name}
				type='channel'
				apiUrl='/api/socket/messages'
				query={{
					channelId: channel.id,
					serverId: channel.serverId,
				}}
			/>
		</div>
	)
}

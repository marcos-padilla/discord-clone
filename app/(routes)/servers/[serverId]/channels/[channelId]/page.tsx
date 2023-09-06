import { getCurrentProfile } from '@/lib/current-profile'
import { redirectToSignIn } from '@clerk/nextjs'
import prisma from '@/lib/db'
import { redirect } from 'next/navigation'
import ChatHeader from '@/components/chat/ChatHeader'
import ChatInput from '@/components/chat/ChatInput'
import ChatMessages from '@/components/chat/ChatMessages'
import { ChannelType } from '@prisma/client'
import MediaRoom from '@/components/MediaRoom'

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
			{channel.type === ChannelType.TEXT ? (
				<>
					<ChatMessages
						member={member}
						name={channel.name}
						chatId={channel.id}
						type='channel'
						apiUrl='/api/messages'
						socketUrl='/api/socket/messages'
						socketQuery={{
							channelId: channel.id,
							serverId: channel.serverId,
						}}
						paramKey='channelId'
						paramValue={channel.id}
					/>
					<ChatInput
						name={channel.name}
						type='channel'
						apiUrl='/api/socket/messages'
						query={{
							channelId: channel.id,
							serverId: channel.serverId,
						}}
					/>
				</>
			) : (
				<MediaRoom
					chatId={channel.id}
					video={channel.type === ChannelType.VIDEO}
					audio={true}
				/>
			)}
		</div>
	)
}

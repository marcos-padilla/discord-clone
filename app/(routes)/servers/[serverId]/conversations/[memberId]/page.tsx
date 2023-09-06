import { getCurrentProfile } from '@/lib/current-profile'
import { redirectToSignIn } from '@clerk/nextjs'
import prisma from '@/lib/db'
import { redirect } from 'next/navigation'
import { getConversation } from '@/lib/conversation'
import ChatHeader from '@/components/chat/ChatHeader'
import ChatMessages from '@/components/chat/ChatMessages'
import ChatInput from '@/components/chat/ChatInput'
import MediaRoom from '@/components/MediaRoom'
interface MemberIdPageProps {
	params: {
		memberId: string
		serverId: string
	}
	searchParams: {
		video?: boolean
	}
}

export default async function MemberIdPage({
	params,
	searchParams,
}: MemberIdPageProps) {
	const profile = await getCurrentProfile()
	if (!profile) {
		return redirectToSignIn()
	}

	const currentMember = await prisma.member.findFirst({
		where: {
			serverId: params.serverId,
			profileId: profile.id,
		},
		include: {
			profile: true,
		},
	})

	if (!currentMember) {
		return redirect('/')
	}
	const conversation = await getConversation(
		currentMember.id,
		params.memberId
	)

	if (!conversation) {
		return redirect(`/servers/${params.serverId}`)
	}

	const { memberOne, memberTwo } = conversation
	const otherMember =
		memberOne.profileId === profile.id ? memberTwo : memberOne
	return (
		<div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
			<ChatHeader
				imageUrl={otherMember.profile.imageUrl}
				name={otherMember.profile.name}
				serverId={params.serverId}
				type='conversation'
			/>
			{searchParams.video ? (
				<MediaRoom
					chatId={conversation.id}
					video={true}
					audio={true}
				/>
			) : (
				<>
					<ChatMessages
						member={currentMember}
						name={otherMember.profile.name}
						chatId={conversation.id}
						type='conversation'
						apiUrl='/api/direct-messages'
						paramKey='conversationId'
						paramValue={conversation.id}
						socketUrl='/api/socket/direct-messages'
						socketQuery={{
							conversationId: conversation.id,
						}}
					/>
					<ChatInput
						name={otherMember.profile.name}
						type='conversation'
						apiUrl='/api/socket/direct-messages'
						query={{
							conversationId: conversation.id,
						}}
					/>
				</>
			)}
		</div>
	)
}

'use client'

import CreateChannelModal from '@/components/modals/CreateChannelModal'
import CreateServerModal from '@/components/modals/CreateServerModal'
import DeleteServerModal from '@/components/modals/DeleteServerModal'
import EditServerModal from '@/components/modals/EditServerModal'
import InviteModal from '@/components/modals/InviteModal'
import LeaveServerModal from '@/components/modals/LeaveServerModal'
import ManageMembersModal from '@/components/modals/ManageMembersModal'
import { useEffect, useState } from 'react'

export default function ModalProvider() {
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		setIsMounted(true)
	}, [])

	if (!isMounted) return null
	return (
		<>
			<CreateServerModal />
			<InviteModal />
			<EditServerModal />
			<ManageMembersModal />
			<CreateChannelModal />
			<LeaveServerModal />
			<DeleteServerModal />
		</>
	)
}

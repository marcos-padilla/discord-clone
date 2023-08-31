'use client'

import CreateServerModal from '@/components/modals/CreateServerModal'
import InviteModal from '@/components/modals/InviteModal'
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
		</>
	)
}

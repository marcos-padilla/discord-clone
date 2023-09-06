import './globals.css'
import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import { cn } from '@/lib/utils'

import { ClerkProvider } from '@clerk/nextjs'
import ThemeProvider from '@/providers/theme-provider'
import ModalProvider from '@/providers/modal-provider'
import { SocketProvider } from '@/providers/socket-provider'
import QueryProvider from '@/providers/query-provider'

const font = Open_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Discord Clone',
	description: 'Discord Clone using Next JS 13 for learning pourposes',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<ClerkProvider>
			<html lang='en' suppressHydrationWarning>
				<body
					className={cn(
						font.className,
						'bg-white dark:bg-[#313338]'
					)}
				>
					<ThemeProvider
						attribute='class'
						defaultTheme='dark'
						enableSystem
						storageKey='discord-theme'
					>
						<SocketProvider>
							<ModalProvider />
							<QueryProvider>{children}</QueryProvider>
						</SocketProvider>
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	)
}

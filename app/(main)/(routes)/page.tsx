import { ToggleTheme } from '@/components/ToggleTheme'
import { UserButton } from '@clerk/nextjs'
export default function Home() {
	return (
		<div>
			<UserButton afterSignOutUrl='/' />
			<ToggleTheme />
		</div>
	)
}

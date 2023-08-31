import { Member, Profile, Server, Channel } from '@prisma/client'

export type ExtendedServer = Server & {
	members: (Member & { profile: Profile })[]
	channels: Channel[]
}

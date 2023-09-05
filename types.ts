import { Member, Profile, Server, Channel } from '@prisma/client'
import { Server as NetServer, Socket } from 'net'
import { NextApiResponse } from 'next'
import { Server as SocketIOServer } from 'socket.io'

export type ExtendedServer = Server & {
	members: (Member & { profile: Profile })[]
	channels: Channel[]
}

export type NextApiResponseServerIO = NextApiResponse & {
	socket: Socket & {
		server: NetServer & {
			io: SocketIOServer
		}
	}
}

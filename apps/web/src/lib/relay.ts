import { Socket, io } from 'socket.io-client'
import type { ClientToServerEvents, Command, ServerToClientEvents } from '@repo/command-parser'
import { RELAY_KEY, RELAY_URL } from '$env/static/private'


const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(RELAY_URL, {
    auth: {
        token: RELAY_KEY
    }
})


async function relay(command: Command) {
    return await socket.emitWithAck('command', command)
}

export default relay
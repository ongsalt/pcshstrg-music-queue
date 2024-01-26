import { expect, test } from 'vitest'
import { Socket, io } from 'socket.io-client'
import { configDotenv } from 'dotenv'
import { ClientToServerEvents, ServerToClientEvents } from '@repo/command-parser'

configDotenv()

// This need the @repo/relay and @repo/counter to be started
test('Relay server', async () => {
    // Simulate 'frontend' client
    const RELAY_URL = 'http://localhost:3069'
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(RELAY_URL, {
        auth: {
            token: process.env.FRONTEND_KEY!
        }
    })

    const resP = await socket.timeout(10000).emitWithAck("ping")
    console.log(resP)

    const res = await socket.emitWithAck("command", {
        type: 'add',
        search: 'Mississippi Fred McDowell - You gotta move',
    })

    const res2 = await socket.emitWithAck("command", {
        type: 'play'
    })

    expect([res, res2]).toStrictEqual(['ok', 'ok'])
})
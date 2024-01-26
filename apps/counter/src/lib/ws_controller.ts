import { ClientToServerEvents, ServerToClientEvents } from "@repo/command-parser"
import { Socket, io } from "socket.io-client"
import { Application } from "./app"
import { Logger } from "./logger"

export class WsController {
    isStart = false
    socket: Socket<ServerToClientEvents, ClientToServerEvents> | undefined
    logger = new Logger('WsController', 'yellow')

    constructor(public app: Application) { }

    async start() {
        this.isStart = true
        this.socket = io(process.env.RELAY_URL!, {
            auth: {
                token: process.env.RELAY_KEY!
            }
        })
        this.registerCommand()
        this.logger.log('Testing relay server connection...')
        
        try {
            await this.socket.timeout(10000).emitWithAck('ping')
            this.logger.log('Ok')
        } catch (e) {
            this.logger.log('Relay server is down or unreachable. Ignoring WebSocket connection...')
        }
    }

    registerCommand() {
        this.socket!.on('command', async (command, callback) => {
            try {
                switch (command.type) {
                    case 'add':
                        await this.app.yt.searchAndAddToQueue(command.search)
                        break
                    case 'remove':
                        throw new Error("Not implemented yet")
                        await this.app.yt
                        break
                    case 'play':
                        await this.app.yt.play()
                        break
                    case 'pause':
                        await this.app.yt.pause()
                        break
                    default :
                        callback('unknow command')
                        return
                }
                callback('ok')
            } catch (e: unknown) {
                callback('error')
            }
        })

    }

    stop() {
        this.isStart = false
        this.socket?.close()
    }
}
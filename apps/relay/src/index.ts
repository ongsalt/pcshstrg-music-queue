import { configDotenv } from 'dotenv';
import { Server as WsServer, Socket } from 'socket.io'
import { ClientToServerEvents, ServerToClientEvents } from '@repo/command-parser'
import { createServer } from 'node:http'
import { Flow } from './flow';

configDotenv()

const httpServer = createServer()
const io = new WsServer<ClientToServerEvents, ServerToClientEvents>(httpServer)

const isCounterAvailable = new Flow(false)
let counter: Socket<ClientToServerEvents, ServerToClientEvents> | undefined

io.on("connection", (socket) => {
    // Ping
    socket.on('ping', callback => {
        callback('pong')
    })

    const key = socket.handshake.auth.token as string ?? '';

    const location = socket.request.url ?? ''

    // Check if the client is counter or frontend
    if (key === process.env.COUNTER_KEY) {
        console.log(`Counter connected: ${socket.id}`);
        isCounterAvailable.value = true
        counter = socket

        socket.on("disconnect", (reason) => {
            isCounterAvailable.value = false
            counter = undefined
            console.log(`Counter disconnected: ${socket.id} for ${reason}`);
        });

        // When counter send an event (e.g. ended, puased, played) 
        // -> broadcast to every other client
        // Implement later 

    } else if (key === process.env.FRONTEND_KEY) { // Client is frontend
        console.log(`Frontend connected: ${socket.id}`);
        // When frontend send a command
        socket.on("command", (command, callback) => {
            if (isCounterAvailable.value) {
                // Relay it to counter
                counter!.emit('command', command, message => {
                    callback(message)
                })
            } else {
                callback("Counter PC is not yet available. May be it is turn off or there is some internet problem")
            }
        });

        socket.on("disconnect", (reason) => {
            console.log(`Frontend disconnected: ${socket.id} for ${reason}`);
        });

        isCounterAvailable.on(false, () => {
            socket.emit("message", 'bruh')
        })
    } else { // Invalid key
        socket.disconnect()
        // Tell them to "go fuck yourself"
    }
});

httpServer.listen(3069)
console.log("Start at port 3069")
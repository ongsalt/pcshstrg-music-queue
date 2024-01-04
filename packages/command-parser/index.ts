export type AddCommand = {
    type: "add",
    search: string
}

export type RemoveCommand = {
    type: "remove",
    search: string
}

// export type ReorderCommand = {
//     type: "add",
//     search: string
// }

export type PlayCommand = {
    type: "play",
}

export type PauseCommand = {
    type: "pause",
}

export type Command = AddCommand | RemoveCommand | PlayCommand | PauseCommand

export type CommandResponse = {
    ok: boolean,
    message: string
}

export function parseCommand(payload: string): Command {
    const args = payload.trim().split(" ")

    if (args.length === 0) throw new Error("parse fail")

    if (args.length === 1) {
        if (args[0] === "play" || args[0] === "pause") {
            return {
                type: args[0]
            }
        }
    }

    if (args.length === 2) {
        if (args[0] === "remove" || args[0] === "add") {
            return {
                type: args[0],
                search: args[1]!
            }
        }
    }

    throw new Error("Invalid command")
}

export function stringifyCommand(command: Command): string {
    if (Object.hasOwn(command, 'search')) {
        return command.type + " " + (command as (AddCommand | RemoveCommand)).search
    }
    return command.type
}

export interface ServerToClientEvents {
    message: (message: string) => void;
    ping: (callback: (message: string) => void) => void

    // Only for client Counter only
    command: (command: Command,  onDone: (message: string) => void) => void;
}

export interface ClientToServerEvents {
    command: (command: Command,  onDone: (message: string) => void) => void;
    ping: (callback: (message: string) => void) => void
    
    // Only for client Counter only
    message: (message: string) => void;
}

export interface InterServerEvents {

}

interface SocketData {
    isCounter: boolean
}

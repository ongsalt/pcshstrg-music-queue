import type { Time } from "./interfaces"

export function formatMinutes(seconds: number): string {
    const minute = Math.floor(seconds / 60)
    const second = seconds % 60 
    
    if (second < 10) {
        return `${minute}:0${second}`
    }

    return `${minute}:${second}`
}

export function formatTime(time: Time) {
    return formatMinutes(time.hour * 60 + time.minute)
}
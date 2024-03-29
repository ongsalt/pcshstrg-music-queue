export interface Song {
    /**
     * Title that got parsed from youtube
     */
    ytTitle: string,
    /**
     * Can be either search query or video url
     */
    search: string,
    /**
     * Song requested time
     */
    requestedAt?: Date,
    /**
     * Video that is maded for kid can't be play in miniplayer mode
     * It need some special consideration
     */
    madeForKid: boolean
}

export interface Time {
    hour: number,
    minute: number
}

export interface TimePeriod {
    start: Time,
    end: Time
}

export interface Config {
    enableAutostart: boolean,
    autostart: TimePeriod[],
    googleSheetId: string,
    googleFormUrl: string
}

/**
 * Inactive: cant do anything
 * Active: can receive song request and play it
 */
export type AppState = "inactive" | "active"

export type MayBePromise<T> = T | Promise<T>
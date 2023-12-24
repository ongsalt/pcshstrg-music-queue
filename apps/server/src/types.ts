export interface Song {
    /**
     * Title that got parsed from youtube 
     */
    ytTitle?: string,
    /**
     * Can be either search query or video url
     */
    search: string,
    /**
     * Song requested time
     */
    createdAt: Date 
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
    enable: boolean,
    autostart: TimePeriod[],
    googleSheetId: string,
    googleFormUrl: string
}

/**
 * Inactive: cant do anything unless
 * Prepared: can only receive song request -> might be rarely used
 * Active: can receive song request and play it
 */
export type AppState = "inactive" | "prepared" | "active"
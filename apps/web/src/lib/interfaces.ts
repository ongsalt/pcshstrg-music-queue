export interface Song {
    title: string,
    artist: string,
    url: string,
    /**
     * In second
     */
    duration: number
}

export interface Time {
    hour: number;
    minute: number;
}

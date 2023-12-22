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

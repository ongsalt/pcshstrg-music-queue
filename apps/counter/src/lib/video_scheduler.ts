import { MayBePromise, Song } from "../types"
import { YoutubeDriver } from "./driver"
import { Logger } from "./logger"

// Why do i need to make an async queue when google sheet is enough
export class VideoScheduler {
    // Fetch from google sheet
    // Use rxjs for push based event
    // Diffing
    logger = new Logger('VideoScheduler', 'cyan')

    /**
     * List of songs that is not in yt queue yet
     */
    songsBuffer: string[] = []

    ytQueue: Song[] = []
    playing: Song | undefined

    isPlaying: boolean = false
    hasQueue: boolean = false

    private operationQueue: (() => MayBePromise<void>)[] = []
    private isFlushing = false

    constructor(private yt: YoutubeDriver = new YoutubeDriver()) { }

    async init() {
        await this.yt.init()
    }

    // This need to be interruptable when play/pause command
    private async flushQueue() {
        if (this.isFlushing) return
        this.isFlushing = true

        while (this.operationQueue.length != 0) {
            const op = this.operationQueue.shift()
            await op!()
        }

        this.isFlushing = false
    }

    // If playing.madeForKid is true then 
    //  - isFirstSong -> add second song first
    //                -> if cant just play it
    //  - there is other song after this -> halt all add operation untill this song ended
    //  - fallback: no other song in buffer
    add(songName: string) {
        this.songsBuffer.push(songName)
        this.operationQueue.push(async () => {
            const song = await this.yt.searchAndAddToQueue(songName)
            this.ytQueue.push(song)
            this.hasQueue = true
            this.songsBuffer = this.songsBuffer.filter(it => it !== songName)
        })
        this.flushQueue()
    }

    // It need to happen NOW. It should stop what it is doing and do this first
    play() {
        const playFn = async () => await this.yt.play()
        if (!this.hasQueue) {
            // if there is no first song yet -> ignore 
            if (this.songsBuffer.length === 0 && this.ytQueue.length === 0) {
                this.logger.log("No buffer")
                return
            }

            // Wait till first song got added to yt 
            this.logger.log(`${this.ytQueue.length} ${this.songsBuffer.length}`)
            if (this.ytQueue.length) {
                this.logger.log("First")
                if (this.operationQueue.length === 0) {
                    this.operationQueue.push(playFn);
                } else {
                    this.operationQueue.splice(1, 0, playFn);
                }
                return this.flushQueue()
            }
            if (this.songsBuffer.length) {
                this.logger.log("Second case")
                this.operationQueue.splice(1, 0, playFn);
                return this.flushQueue()
            }
        } else if (!this.isPlaying) {
            this.operationQueue.push(playFn);
            // this.yt.play()
        }
    }

    pause() {
        if (this.isPlaying) {
            this.operationQueue.splice(1, 0, () => this.yt.pause());
        }
    }

    remove() {

    }
}

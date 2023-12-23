import { HttpController } from "./http_controller";
import { YoutubeDriver } from "./driver";
import { Mutex } from "async-mutex";
import { Logger } from "./logger";

/**
 * Handle autostart(system, timing), wire everything together
 */
export class Application {
    /**
     * Main system switch
     */
    isOn = true

    /**
     * Status indicator 
     * Inactive mean app is waiting for autostart
     */
    isActive = false

    logger: Logger
    httpController: HttpController
    yt: YoutubeDriver
    ytMutex: Mutex

    constructor() {
        this.logger = new Logger('main')
        this.yt = new YoutubeDriver()
        this.ytMutex = new Mutex()
        this.httpController = new HttpController(this.ytMutex, this.yt)
    }

    async start({ port }: { port: number } = { port: 3000 }) {
        await this.yt.init() // Fix later

        this.logger.log('Starting')
        this.httpController.start({ port })
    }

}
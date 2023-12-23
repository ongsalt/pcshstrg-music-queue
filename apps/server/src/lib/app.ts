import { Mutex } from "async-mutex";
import { HttpController } from "./http_controller";
import { YoutubeDriver } from "./driver";
import { Logger } from "./logger";
import { AppState } from "../types";

/**
 * Handle autostart(system, timing), wire everything together
 */
export class Application {
    /**
     * Main system switch
     */
    isOn = false

    /**
     * Status indicator 
     * Inactive mean app is waiting for autostart
     */
    state: AppState = "inactive"

    logger: Logger
    httpController: HttpController
    yt: YoutubeDriver
    ytMutex: Mutex

    constructor() {
        this.logger = new Logger('Application')
        this.yt = new YoutubeDriver()
        this.ytMutex = new Mutex()
        this.httpController = new HttpController(this.ytMutex, this.yt)
    }

    /**
     * Initialize application
     * 
     * This will register all  and start http controller 
     */
    async init({ port }: { port: number } = { port: 3000 }) {
        if (this.isOn) {
            return
        }

        this.logger.log('Starting')
        this.httpController.start({ port })

        await this.start()
    } 

    /**
     * Lifecycle method
     */
    async start() {
        this.isOn = true
        await this.yt.init() // Fix later
    }
}
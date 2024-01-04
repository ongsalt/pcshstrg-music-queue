import { Mutex } from "async-mutex";
import { HttpController } from "./http_controller";
import { YoutubeDriver } from "./driver";
import { Logger } from "./logger";
import { AppState } from "../types";
import { withMutex } from "./mutex";
import { WsController } from "./ws_controller";

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

    logger: Logger = new Logger('Application', 'blue')
    httpController: HttpController
    wsController: WsController
    yt: YoutubeDriver
    ytMutex: Mutex

    constructor() {
        this.ytMutex = new Mutex()
        this.yt = withMutex(new YoutubeDriver(), this.ytMutex)
        this.httpController = new HttpController(this)
        this.wsController = new WsController(this)
    }

    /**
     * Initialize application
     * 
     * This will also start http controller 
     */
    async init({ port }: { port: number } = { port: 3000 }) {
        if (this.isOn) {
            return
        }

        this.httpController.start({ port })
        await this.wsController.start()
        await this.startYt()
    }

    /**
     * Lifecycle method
    */
    async startYt() {
        if (this.isOn) {
            return
        }
        this.isOn = true
        await this.yt.init() // Fix later
        this.logger.log('Started')
    }
}
import { serve } from '@hono/node-server'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { Mutex } from 'async-mutex'
import { cors } from 'hono/cors'
import { YoutubeDriver } from './driver'
import { Logger } from './logger'
import { ServerType } from '@hono/node-server/dist/types'

export class HttpController {
    private logger: Logger
    private server: ServerType | undefined;
    router!: Hono;

    constructor(public mutex: Mutex, public yt: YoutubeDriver) {
        this.logger = new Logger('HttpController')

        // Fix Later
        this.logger.log("Registering route...");
        this.registerRoutes()
        this.registerWebsocket()
    }

    /**
     * All operations are currently blocking (response)
     * this return router to make ts type hint possible
    */
    registerRoutes() {
        const router = new Hono()
            .use('/*', cors())
            .post('/play', async c => {
                await this.mutex.runExclusive(() => this.yt.play())
                return c.text('ok')
            })
            .post('/pause', async c => {
                await this.mutex.runExclusive(() => this.yt.pause())
                return c.text('ok')
            })
            .post(
                '/add',
                zValidator(
                    'json',
                    z.object({
                        name: z.string(),
                        createdAt: z.coerce.date()
                    })
                ),
                async c => {
                    const song = c.req.valid('json')
                    await this.mutex.runExclusive(() =>
                        this.yt.searchAndAddToQueue(song.name)
                    )
                    return c.text('ok')
                }
            )
        this.router = router
        return router
    }

    /**
     * Alternative API to REST. Use with command parser
     */
    registerWebsocket() {

    }

    start({ port }: { port: number }) {
        this.server = serve({
            fetch: this.router.fetch,
            port
        })
    }

    stop() {
        this.server?.close()
    }
}

// Missing all control api

export default HttpController
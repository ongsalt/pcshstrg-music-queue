import { serve } from '@hono/node-server'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { cors } from 'hono/cors'
import { YoutubeDriver } from './driver'
import { Logger } from './logger'
import { ServerType } from '@hono/node-server/dist/types'
import { Application } from './app'

export class HttpController {
    public yt: YoutubeDriver

    private logger: Logger = new Logger('HttpController')
    private server: ServerType | undefined;
    private router!: Hono;

    constructor(private app: Application) {
        this.yt = app.yt

        // Fix Later
        // this.logger.log("Registering route...");
        this.registerRoutes()
    }

    /**
     * All operations are currently blocking (response)
     * this return router to make ts type hint possible
    */
    registerRoutes() {
        const router = new Hono()
            .use('/*', cors())
            .post('/play', async c => {
                await this.yt.play()
                return c.text('ok')
            })
            .post('/pause', async c => {
                await this.yt.pause()
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
                    await this.yt.searchAndAddToQueue(song.name)
                    return c.text('ok')
                }
            )
        this.router = router
        return router
    }

    start({ port }: { port: number }) {
        this.logger.log("Server is started")
        this.server = serve({
            fetch: this.router.fetch,
            port
        })
    }

    stop() {
        this.server?.close()
        this.logger.log("Server is closing...")
    }
}

// Missing all control api

export default HttpController
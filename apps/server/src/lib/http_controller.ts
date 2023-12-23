import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { YoutubeDriver } from './driver'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { Mutex } from 'async-mutex'
import { Logger } from './logger'


export class HttpController {
    private logger: Logger
    router!: Hono;

    constructor(public mutex: Mutex, public yt: YoutubeDriver) {
        this.logger = new Logger('HttpController')

        // Fix Later
        this.logger.log("Registering route...");
        this.registerRoutes()
    }

    registerRoutes() {
        this.router = new Hono()
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
    }

    async start({ port }: { port: number }) {
        serve({
            fetch: this.router.fetch,
            port
        })
    }
}

// Missing all control api

export default HttpController
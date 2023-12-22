import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { YoutubeDriver } from './lib/driver'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { Mutex } from 'async-mutex'
import { Log } from './lib/logger'

Log.main("Starting...");
const server = new Hono()
const mutex = new Mutex()
const yt = new YoutubeDriver()

Log.main("Initializing selenium...");
await yt.init()

/**
 * Routes
 */
server.post('/play', async c => {
    await mutex.runExclusive(() => yt.play())
    return c.text('ok')
})

server.post('/pause', async c => {
    await mutex.runExclusive(() => yt.pause())
    return c.text('ok')
})

server.post(
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
        await mutex.runExclusive(() =>
            yt.searchAndAddToQueue(song.name)
        )
        return c.text('ok')
    }
)

// Missing all control api

Log.main("Server started at http://localhost:3000");
serve({
    fetch: server.fetch,
    port: 3000
})

export type AppType = typeof server
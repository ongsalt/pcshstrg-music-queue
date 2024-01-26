import puppeteer, { Browser, Page } from 'puppeteer';
import path from 'path';

import { Logger } from "./logger";
import chalk from "chalk";
import { MayBePromise, Song } from '../types';

/**
 * ถ้าไม่มีคิวต่อ จะเล่นเพลงเอง
 */
export class YoutubeDriver {

    private browser!: Browser
    private page!: Page
    /**
     * Mirror of all items in current yt playlist 
    */

    songNames: string[] = []

    playing: string | undefined // Not implemented yet
    isKidMode: boolean = false
    initialized = false
    isMiniplayer = true
    isPlaying = false
    hasQueue = false

    private logger: Logger = new Logger('YoutubeDriver', 'red')

    private onSongChangedListener: ((name: string) => void)[] = []
    private onSongEndedListener: { callback: () => void, once: boolean }[] = []

    async init() {
        if (this.initialized) {
            throw new Error('Youtube page is already initialized')
        }
        this.logger.log("Initializing...")

        const pathToExtension = path.join(process.cwd(), 'resources/ublock');
        // Load uBlock origin
        this.browser = await puppeteer.launch({
            headless: false,
            args: [
                `--disable-extensions-except=${pathToExtension}`,
                `--load-extension=${pathToExtension}`,
            ],
            ignoreDefaultArgs: [
                '--disable-extensions'
            ],
            timeout: 120000 // 2 Minutes
        })

        await this.delay(5000) // To make ublock work porperly

        this.page = await this.browser.newPage();

        // Need some error handlling
        await this.page.goto('https://youtube.com', {
            waitUntil: 'networkidle0',
            timeout: 180000 // 3 min
        })

        this.registerAdsFallback()

        this.logger.log("Done")
        this.initialized = true
    }

    async destroy() {
        await this.browser.close();
        this.initialized = false
        this.logger.log("Destroy")
    }

    async delay(ms: number = 250, noiseRange = 50) {
        const totalDelay = ms + Math.random() * noiseRange
        await new Promise(r => setTimeout(r, totalDelay));
    }

    async waitUntilSPAPageLoaded() {
        await this.page.waitForSelector('yt-page-navigation-progress[aria-valuenow="100"]')
        // this.logger.log('SPAPageLoaded')
    }

    async searchAndAddToQueue(text: string): Promise<Song> {
        let madeForKid = false
        // Search
        this.logger.log(`Searching for ${chalk.underline(chalk.bold(text))}.`)

        const sb = this.page.locator('input#search')
        await sb.fill(text)
        await this.delay(100)

        // await this.page.locator('button#search-icon-legacy').hover()
        // // When query is in Thai this thing broke -> need to reclick it
        await this.delay(200)
        // await this.page.locator('button#search-icon-legacy').click()

        const searchButton = await this.page.waitForSelector('button#search-icon-legacy')
        await searchButton?.hover()
        await this.delay(200, 20)
        await searchButton?.click({ count: 2 })

        await this.waitUntilSPAPageLoaded()
        await this.delay(2000)

        // Check if it's made for kids or not
        // this will throw if ytd-thumbnail-overlay-inline-unplayable-renderer is not found
        // try {
        //     await this.page.locator('ytd-video-renderer a#thumbnail').hover()
        //     // Should try different timeout later
        //     const cantPlayIcon = await this.page.waitForSelector('ytd-thumbnail-overlay-inline-unplayable-renderer', { timeout: 500 })
        //     if (cantPlayIcon) {
        //         madeForKid = true
        //     }
        // } catch {
        //     madeForKid = true
        // }

        // if (!this.hasQueue) {
        //     await this.playInNormalMode()
        // } else {
        // Click 'menu' then 'add to queue'
        // const menu = this.page.locator('ytd-video-renderer #button.yt-icon-button')
        const menu = await this.page.waitForSelector('ytd-video-renderer #button.yt-icon-button')
        // it click other thing when i dont do this
        await menu?.hover()
        await this.delay(200, 10)
        await menu?.click()
        await this.delay(200, 10)

        // Click 'Add to queue' button
        // await this.page.locator('ytd-menu-service-item-renderer:first-child').click()
        const addToQBtn = await this.page.waitForSelector('ytd-menu-service-item-renderer:first-child')
        await addToQBtn?.click()
        await this.delay(350)
        // }

        // Add current song names to songNames
        // const songNameEl = await this.page.waitForSelector('ytd-video-renderer a#video-title')
        const songName = await this.page.locator('ytd-video-renderer a#video-title').map(it => it.textContent?.trim()).wait() ?? 'Unknown song'

        // console.log(songNameEl)
        // const songName = songNameEl?.evaluate('')
        this.songNames.push(songName)

        this.logger.log(`Added ${chalk.underline(chalk.bold(songName))} to queue.`)

        await this.delay(250)

        if (!this.hasQueue) {
            await this.maximize()
            this.hasQueue = true
            await this.minimize()
            // await this.registerOnSongEnded()
        }

        return {
            search: text,
            ytTitle: songName,
            madeForKid
        }
    }

    async playInNormalMode() {
        const videoLink = await this.page.waitForSelector('ytd-video-renderer ytd-thumbnail')
        // it click other thing when i dont do this
        await videoLink?.hover()
        await this.delay(300, 10)
        await videoLink?.click()
        await this.delay(300, 10)
        await this.minimize()
        await this.pause(true)
        await this.delay(300, 10)
    }

    /**
    * When the video end it will be replay button
    */
    async playOrPause() {
        await this.delay(100)
        // this.page.evaluate(() => {
        //     document.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'k' }));
        // })

        await this.page.locator('button.ytp-play-button.ytp-button').click()
    }

    // Need to autocorrect itself
    async play(force = false) {
        if (!this.isPlaying || force) {
            this.isPlaying = true
            await this.playOrPause()
        }
    }

    async pause(force = false) {
        if (this.isPlaying || force) {
            this.isPlaying = false
            await this.ensurePlayerState(false)
        }
    }

    private async ensurePlayerState(playing: boolean) {
        const getPlayerState = async () => await this.page.locator('video.video-stream').map(it => !it.paused).wait()
        while (await getPlayerState() != playing) {
            this.logger.log("Spamming play button rn")
            await this.playOrPause()
            await this.delay(100, 25)
        }
    }

    async maximize() {
        if (this.isMiniplayer) {
            this.isMiniplayer = false
            await this.delay(100)
            try {
                await this.page.locator('button.ytp-miniplayer-expand-watch-page-button').setTimeout(300).click()
            } catch {
                await this.page.keyboard.press('i')
            }
        } else {
            console.log("Already maximized")
        }
    }

    async minimize() {
        if (!this.isMiniplayer) {
            this.isMiniplayer = true
            await this.delay(100)
            try {
                await this.page.locator('button.ytp-button[data-title-no-tooltip="Miniplayer"]').setTimeout(300).click()
            } catch {
                await this.page.keyboard.press('i')
            }
        } else {
            console.log("Already minimized")
        }
    }

    async waitUntilVideoLoaded() {
        // this.delay(200)
        await this.page.locator('video.video-stream').wait()
    }

    async waitUntilVideoEnd() {
        let resolve!: () => void;
        const promise = new Promise<void>(res => {
            return (resolve = res);
        });

        await this.addOnVideoEndListener(resolve)

        await promise
    }

    async addOnVideoEndListener(callback: () => MayBePromise<void>, once = true) {
        this.onSongEndedListener.push({
            callback,
            once
        })
    }

    // Should be called when there is a video
    private async registerOnSongEnded() {
        this.page.exposeFunction('onSongEnded', () => {
            this.onSongEndedListener.forEach(it => it.callback())
            this.onSongEndedListener = this.onSongEndedListener.filter(it => !it.once)
        })

        await this.page.evaluate(() => {
            const videoElement: HTMLVideoElement = document.querySelector('video.video-stream')!
            videoElement!.addEventListener('ended', function thisThing(): void {
                // @ts-ignore This is the name of function we just exposed 
                window.onSongEnded()
                videoElement!.removeEventListener('ended', thisThing)
            })
        })
    }

    // 

    async getDuration() {
        this.delay(100)
        const durationElement = await this.page.locator('span.ytp-time-duration').wait()
        // const currentElement = await this.page.findElement(By.css('span.ytp-time-current'))

        const duration = durationElement.textContent
        console.log(duration)
        // console.log(await currentElement.getText())

        return duration
    }


    onSongChanged(callback: (name: string) => void) {
        this.onSongChangedListener.push(callback)
    }

    private registerAdsFallback() {
        // TODO
    }
}
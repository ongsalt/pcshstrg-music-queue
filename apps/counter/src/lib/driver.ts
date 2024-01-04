import puppeteer, { Browser, Page } from 'puppeteer';
import path from 'path';

import { Logger } from "./logger";
import chalk from "chalk";

/**
 * ถ้าไม่มีคิวต่อ จะเล่นเพลงเอง
 */
export class YoutubeDriver {

    private browser!: Browser
    private page!: Page
    /**
     * Mirror of all items in current yt playlist 
    */

    toAddSongs: string[] = []
    songNames: string[] = []

    playing: string | undefined // Not implemented yet
    isKidMode: boolean = false
    initialized = false
    isMiniplayer = true
    isPlaying = false

    private logger: Logger = new Logger('YoutubeDriver', 'red')

    private onSongChangedListener: ((name: string) => void)[] = []

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
            waitUntil: 'networkidle2',
            timeout: 60000 // 1 min
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

    async delay(ms: number = 1000, noiseRange = 100) {
        const totalDelay = ms + Math.random() * noiseRange
        await new Promise(r => setTimeout(r, totalDelay));
    }

    async waitUntilSPAPageLoaded() {
        await this.page.waitForSelector('yt-page-navigation-progress[aria-valuenow="100"]')
        // this.logger.log('SPAPageLoaded')
    }

    async searchAndAddToQueue(text: string) {
        // Search
        this.logger.log(`Searching for ${chalk.underline(chalk.bold(text))}.`)

        await this.page.locator('input#search').fill(text)

        await this.delay(200)

        await this.page.locator('button#search-icon-legacy').click()
        // this.logger.log('Clicked search')

        await this.waitUntilSPAPageLoaded()
        await this.delay(100)

        // Click 'menu' then 'add to queue'
        await this.page.locator('ytd-video-renderer #button').click()

        // Click 'Add to queue' button
        await this.page.locator('ytd-menu-service-item-renderer').click()

        await this.delay(350)

        // Add current song names to songNames
        // const songNameEl = await this.page.waitForSelector('ytd-video-renderer a#video-title')
        const songName = await this.page.locator('ytd-video-renderer a#video-title').map(it => it.textContent?.trim()).wait() ?? 'Unknown song'

        // console.log(songNameEl)
        // const songName = songNameEl?.evaluate('')
        this.songNames.push(songName)

        this.logger.log(`Added ${chalk.underline(chalk.bold(songName))} to queue.`)

        await this.delay(250)
    }

    private async flushQueue() {

    }

    /**
    * When the video end it will be replay button
    */
    async playOrPause() {
        this.isPlaying = !this.isPlaying
        await this.delay(100)
        await this.page.locator('button.ytp-play-button').click()
    }

    async play() {
        if (!this.isPlaying) {
            await this.playOrPause()

            // If yt show #blocking-container -> It is Kids mode 
            // We need to wait for it to end before we can do anything again or else the video will be interupt
            // try {
            //     // This will turn off miniplayer mode
            //     await this.page.locator('#blocking-container').click()
            //     this.isMiniplayer = false

            //     this.isKidMode = true
            //     // turn off autoplay if there is something in queue
            //     // Wait until this video end then mute before we do search and add other song (We can still pause)
            //     // page.waitUntil should be enough as this will block any other page operation 

            //     // Click LARGE play button
            //     this.page.locator('.ytp-large-play-button').click()

            // } catch {
            //     // Ok yt did allow us
            //     await this.playOrPause()
            // }
        }

        await this.playOrPause()
        // This is how we attach event listener to page
    }

    async pause() {
        if (this.isPlaying) {
            await this.playOrPause()
        }
    }

    async maximize() {
        if (this.isMiniplayer) {
            this.isMiniplayer = false
            await this.delay(100)
            await this.page.locator('button.ytp-miniplayer-expand-watch-page-button').click()
        } else {
            console.log("Already maximized")
        }
    }

    async minimize() {
        if (!this.isMiniplayer) {
            this.isMiniplayer = true
            await this.delay(100)
            await this.page.locator('button.ytp-button[data-title-no-tooltip="Miniplayer"]').click()
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

        await this.page.exposeFunction('onVideoEnded', () => {
            resolve()
        })

        await this.page.evaluate(() => {
            const videoElement = document.querySelector('video.video-stream')
            videoElement!.addEventListener('ended', () => {
                // @ts-ignore This is the name of function we just exposed 
                window.onVideoEnded()
            })
        })

        await promise
    }

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
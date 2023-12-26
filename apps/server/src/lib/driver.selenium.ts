import { Builder, By, WebDriver, until } from "selenium-webdriver";
import * as Chrome from "selenium-webdriver/chrome";
import { Logger } from "./logger";
import chalk from "chalk";

/**
 * ถ้าไม่มีคิวต่อ จะเล่นเพลงเอง
 */
export class YoutubeDriver {

    private driver!: WebDriver;
    /**
     * Mirror of all items in current yt playlist 
    */
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
            throw new Error('Youtube driver is already initialized')
        }
        this.logger.log("Initializing...")
        // Load uBlock origin
        const options = new Chrome.Options()
            .addExtensions('resources/ublock.crx')

        this.driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        await this.driver.manage().setTimeouts({ implicit: 2000 });

        await this.delay(1000) // make uBlock origin work properly
        await this.driver.get('https://youtube.com')

        this.registerAdsFallback()

        this.initialized = true
    }

    async destroy() {
        await this.driver.close()
        this.initialized = false
        this.logger.log("Destroy")
    }

    // This wont work with selenium
    private async registerEventListener() {
        await this.driver.executeAsyncScript((resolve: () => void) => {

            // Check for video element src change
            // video.video-stream

            window.addEventListener('locationchange', function onLocationChanged() {
                window.removeEventListener('locationchange', onLocationChanged);
                resolve();
            });

        })
    }

    async delay(ms: number = 1000, noiseRange = 100) {
        const totalDelay = ms + Math.random() * noiseRange
        await this.driver.sleep(totalDelay)
    }

    async waitUntilSPAPageLoaded() {
        await this.driver.wait(until.elementLocated(By.css('yt-page-navigation-progress[aria-valuenow="100"]')))
    }

    async searchAndAddToQueue(text: string) {
        // Search
        this.logger.log(`Searching for ${chalk.underline(chalk.bold(text))}.`)

        const searchbox = await this.driver.findElement(By.css('input#search'))
        await searchbox.clear()
        await searchbox.sendKeys(text)
        await this.delay(200)
        await this.driver.findElement(By.id('search-icon-legacy')).click()

        await this.waitUntilSPAPageLoaded()

        // Click 'menu' then 'add to queue'
        const videoLink = await this.driver.findElement(By.css('ytd-video-renderer'))
        const videoMenuButton = await videoLink.findElement(By.css('#button'))
        await this.delay(100) // yt will lag for abit before showing the menu
        await videoMenuButton.click()

        // Find 'Add to queue' button
        const addToQueueButton = await this.driver.findElement(By.css('ytd-menu-service-item-renderer'))
        await addToQueueButton.click()

        // Add current song names to songNames
        const songName = await videoLink.findElement(By.css('a#video-title')).getText()
        this.songNames.push(songName)

        this.logger.log(`Added ${chalk.underline(chalk.bold(songName))} to queue.`)

        await this.delay(1500)
    }

    /**
    * When the video end it will be replay button
    */
    async playOrPause() {
        this.isPlaying = !this.isPlaying
        await this.delay(100)
        await this.driver.findElement(By.css('button.ytp-play-button')).click()
    }

    async play() {
        if (!this.isPlaying) {
            // If yt show #blocking-container -> It is Kids mode 
            // We need to wait for it to end before we can do anything again or else the video will be interupt
            try {
                const blockingContainer = await this.driver.findElement(By.css('#blocking-container'))
                await blockingContainer.click() // This will turn off miniplayer mode
                this.isMiniplayer = false

                this.isKidMode = true
                // turn off autoplay if there is something in queue
                // Wait until this video end then mute before we do search and add other song (We can still pause)
                // driver.waitUntil should be enough as this will block any other driver operation 

                const playBtn = await this.driver.findElement(By.css('.ytp-large-play-button'))
                await playBtn.click()

            } catch {
                // Ok yt did allow us
                await this.playOrPause()
            }
        }

        // This is how we attach event listener to page

        await this.driver.executeAsyncScript((resolve: () => void) => {

            // Check for video element src change
            // video.video-stream

            window.addEventListener('locationchange', function onLocationChanged() {
                window.removeEventListener('locationchange', onLocationChanged);
                resolve();
            });
        })
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
            await this.driver.findElement(By.css('button.ytp-miniplayer-expand-watch-page-button')).click()
        } else {
            console.log("Already maximized")
        }
    }

    async minimize() {
        if (!this.isMiniplayer) {
            this.isMiniplayer = true
            await this.delay(100)
            await this.driver.findElement(By.css('button.ytp-button[data-title-no-tooltip="Miniplayer"]')).click()
        } else {
            console.log("Already minimized")
        }
    }

    async waitUntilVideoLoaded() {
        this.delay(200)
        await this.driver.wait(until.elementsLocated(By.css('video.video-stream')))
    }

    async waitUntilVideoEnd() {
        this.delay(200)
        const currentElement = await this.driver.findElement(By.css('span.ytp-time-current'))

        const duration = await this.getDuration()
        await this.driver.wait(until.elementTextIs(currentElement, duration))
    }

    async getDuration() {
        this.delay(100)
        const durationElement = await this.driver.findElement(By.css('span.ytp-time-duration'))
        // const currentElement = await this.driver.findElement(By.css('span.ytp-time-current'))

        const duration = await durationElement.getText()
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
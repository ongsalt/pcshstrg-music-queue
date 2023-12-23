import { Builder, By, Key, WebDriver, until } from "selenium-webdriver";
import * as Chrome from "selenium-webdriver/chrome";


/**
 * ถ้าไม่มีคิวต่อ จะเล่นเพลงเอง
 */
export class YoutubeDriver {
    private driver!: WebDriver;
    songNames: string[] = []
    initialized = false
    isMiniplayer = true
    isPlaying = false

    private onSongChangedListener: ((name: string) => void)[] = []

    async init() {
        if (this.initialized) {
            throw new Error('Youtube driver is already initialized')
        }
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

        this.initialized = true
    }
    
    async destroy() {
        await this.driver.close()
        this.initialized = false
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
            await this.playOrPause()
        }
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

}
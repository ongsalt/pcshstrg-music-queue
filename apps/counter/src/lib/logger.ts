import chalk, { ChalkInstance, ColorName } from 'chalk'

export class Logger {
    static enabled = true
    static logFunction: (...params: unknown[]) => void = console.log
    private colored: ChalkInstance
    constructor(public prefix: string, color: ColorName = 'green') {
        this.colored = chalk[color]
    }

    log(...slug: any[]) {
        if (Logger.enabled) {
            const prefix = this.pad(`[${this.prefix}]`)
            Logger.logFunction(this.colored(chalk.bold(prefix), chalk.reset(slug)))
        }
    }

    private pad(text: string, width = 18) {
        const left = width - text.length
        if (left <= 0) {
            return text + ''
        }

        return text + ' '.repeat(left)
    }
}
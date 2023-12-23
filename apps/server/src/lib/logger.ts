import chalk from 'chalk'

export class Logger {
    constructor(public prefix: string) {}

    log(...slug: any[]) {
        console.log(chalk.green(`[${this.prefix}]`, slug))
    }
}
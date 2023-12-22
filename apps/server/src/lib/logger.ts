import chalk from 'chalk'

export class Log {
    static main(...slug: any[]) {
        console.log(chalk.green('[Main]', slug))
    }
}
import { Config } from "../types";

export class ConfigStorage {
    private latestSaved: Date = new Date()
    private latestModified: Date = new Date()
    private config: Config

    constructor() {
        // Default
        this.config = {
            autostart: [{
                start: {
                    hour: 7,
                    minute: 0
                },
                end: {
                    hour: 7,
                    minute: 50
                }
            }],
            enable: true,
            googleSheetId: '12'
        }
    }
    
    async load() {
        // Fucking read it some how
        this.config = {
            autostart: [],
            enable: true,
            googleSheetId: '12'
        }
    }

    get<T extends keyof Config>(key: T): Config[T] {
        return this.config[key]
    }

    set<T extends keyof Config>(key: T, value: Config[T]){
        this.config[key] = value
        this.latestModified = new Date()
        this.saveToDisk()
    }

    private async saveToDisk() {
        if (this.latestModified > this.latestSaved) {
            // Save it
        }
        this.latestSaved = new Date()
    }
}
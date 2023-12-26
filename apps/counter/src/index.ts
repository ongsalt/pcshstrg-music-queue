import { Application } from "./lib/app";

const app = new Application()

await app.init()

export type RPC = ReturnType<typeof app.httpController.registerRoutes>

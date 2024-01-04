import { configDotenv } from "dotenv";
import { Application } from "./lib/app";

configDotenv()

const app = new Application()

await app.init()

export type RPC = ReturnType<typeof app.httpController.registerRoutes>

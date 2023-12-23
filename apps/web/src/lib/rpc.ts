import type { RPC } from "@repo/server";
import { hc } from "hono/client"
import { env } from '$env/dynamic/public';


console.log("Server: ", env.PUBLIC_SERVER_URL)
export const rpc = hc<RPC>(env.PUBLIC_SERVER_URL)

import type { RPC } from "@repo/server";
import { hc } from "hono/client"
import { PUBLIC_SERVER_URL } from '$env/static/public';

console.log("Server: ", PUBLIC_SERVER_URL)
export const rpc = hc<RPC>(PUBLIC_SERVER_URL)

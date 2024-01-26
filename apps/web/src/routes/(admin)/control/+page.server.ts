import type { Actions } from "./$types";
import relay from "$lib/relay";

export const actions: Actions = {
    async pause() {
        await relay({ type: 'pause' })
    },
    async play() {
        console.log(await relay({ type: 'play' }))
    },
    async add({ request }) {
        const formData = await request.formData()
        const search = formData.get('search')
        if (!search) {
            return
        }
        if (typeof search != 'string') {
            return
        }
        await relay({ type: 'add', search })
    }
}
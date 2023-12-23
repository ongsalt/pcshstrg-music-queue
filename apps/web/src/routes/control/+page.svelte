<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import { rpc } from "$lib/rpc";

    let search: string;

    async function add() {
        console.log("sending");
        const res = await rpc.add.$post({
            json: {
                createdAt: new Date(),
                name: search,
            },
        });
        console.log(await res.text());
    }

    async function play() {
        console.log("sending");
        const res = await rpc.play.$post();
        console.log(await res.text());
    }

    async function pause() {
        console.log("sending");
        const res = await rpc.pause.$post();
        console.log(await res.text());
    }
</script>

<button
    on:click={() => history.back()}
    class="[view-transition-name:title] text-left w-20 text-blue-500"
>
    กลับ
</button>

<h1 class="text-center font-bold text-2xl mt-4">Devtools</h1>

<div class="border rounded-md p-4 mt-4">
    <Input type="text" bind:value={search} placeholder="ASU - リンカーネイション"/>
    <Button on:click={add}>Add to queue</Button>
    <Button on:click={play}>Play</Button>
    <Button on:click={pause}>Pause</Button>
</div>

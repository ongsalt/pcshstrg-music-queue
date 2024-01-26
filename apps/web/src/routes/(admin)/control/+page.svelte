<script lang="ts">
    import { enhance } from "$app/forms";
    import Button from "$lib/components/ui/button/button.svelte";
    import Input from "$lib/components/ui/input/input.svelte";

    let search: string = "ASU - リンカーネイション";

</script>

<button
    on:click={() => history.back()}
    class="[view-transition-name:title] text-left w-20 text-blue-500"
>
    กลับ
</button>

<h1 class="text-center font-bold text-2xl mt-4">Test</h1>

<form method="post" action="?/add" use:enhance>
    <div class="border rounded-md p-4 mt-4">
        <Input name="search" type="text" bind:value={search} placeholder="Search..." />
        <Button type="submit">Add to queue</Button>
        <Button type="submit" formaction="?/play">Play</Button>
        <Button type="submit" formaction="?/pause">Pause</Button>
    </div>
</form>

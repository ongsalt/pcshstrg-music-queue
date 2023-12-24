<script>
  import Button from "$lib/components/ui/button/button.svelte";
  import Playlist from "./Playlist.svelte";
</script>

<div class="flex flex-col h-screen gap-4 max-w-full">
  <div class="flex justify-between items-center mt-6 mx-4">
    <div>
      <h1 class="text-3xl font-medium">App name</h1>
      <h1 class="font opacity-50">ควยไร</h1>
    </div>
    <a href="https://google.com">
      <Button>ขอเพลง</Button>
    </a>
  </div>
  <Playlist class="h-96 border rounded-md flex-1 mt-2 mx-4" />
  <div class="w-full bg-secondary border-t py-2">
    <a class="text-sm text-center underline underline-offset-4 leading-4 block" href="/about">
      Made with 😭 from AV team
    </a>
  </div>
</div>

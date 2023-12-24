<script lang="ts">
  import { formatMinutes } from "$lib/format";
  import type { Song } from "$lib/interfaces";
    import { cn } from "$lib/utils";
  import Icon from "@iconify/svelte";

  let className = ""
  export { className as class };

  const songs: Song[] = [];

  for (let i = 0; i < 40; i++) {
    songs.push({
      title: "Gaythai",
      artist: "tee",
      duration: 15,
      url: "youtube.com/454545",
    });
  }
</script>

<div class={cn("[view-transition-name:playlist] flex flex-col", className)}>
  <div class="stick border-b px-4 h-12 flex justify-between items-center">
    <h2 class="textlgl font-bold">ลำดับเพลง</h2>
    <div class="flex">
      <button class="hover:bg-black/5 transition p-2 rounded">
        <Icon icon="material-symbols:refresh-rounded" class="text-xl" />
      </button>
      <button class="hover:bg-black/5 transition p-2 rounded">
        <Icon icon="material-symbols:edit-outline-rounded" class="text-xl" />
      </button>
    </div>
  </div>
  <div class="overflow-y-auto flex-1">
    <div class="px-2 my-4 space-y-1">
      <div
        class="flex justify-between items-center bg-primary text-primary-foreground shadow-md p-2 rounded-md"
      >
        <div>
          <h4 class="leading-5">リンカーネイション</h4>
          <h4 class="text-sm opacity-50">ASU</h4>
        </div>
        <span> 0:45 </span>
      </div>
      {#each songs as song}
        <div
          class="flex justify-between items-center p-2 rounded-md hover:bg-secondary-foreground/5 transition"
        >
          <div>
            <h4 class="leading-5">{song.title}</h4>
            <h4 class="text-sm opacity-50">{song.artist}</h4>
          </div>
          <span>{formatMinutes(song.duration)} </span>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  :root::view-transition-old(playlist) {
    z-index: 100;
  }
</style>

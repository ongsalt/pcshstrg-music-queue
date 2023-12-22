<script lang="ts">
  import "../app.css";
  import "@fontsource/inter";
  import "@fontsource/poppins";
  import Playlist from "./Playlist.svelte";
  import { onNavigate } from "$app/navigation";

  let pageContainer: HTMLDivElement;

  onNavigate((navigation) => {
    // @ts-ignore
    if (!document.startViewTransition) return;

    if (
      navigation.type === "popstate" &&
      navigation.delta &&
      navigation.delta < 0
    ) {
      // @ts-expect-error
      pageContainer.style.viewTransitionName = "page-backward";
    } else {
      // @ts-expect-error
      pageContainer.style.viewTransitionName = "page-forward";
    }
    return new Promise((resolve) => {
      // @ts-ignore
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>

<div class="select-none grid grid-cols-2 min-h-screen">
  <div class="p-4 flex flex-col bg-background" bind:this={pageContainer}>
    <slot />
  </div>
  <Playlist />
</div>

<style>
  @keyframes slide-from-right {
    from {
      translate: calc(100% + 1rem) 0;
    }
  }

  @keyframes slide-to-left {
    to {
      filter: brightness(0.85);
      translate: -25% 0;
    }
  }

  @keyframes slide-to-right {
    to {
      translate: calc(100% + 1rem) 0;
    }
  }

  @keyframes slide-from-left {
    from {
      filter: brightness(0.75);
      translate: -25% 0;
    }
  }

  :root::view-transition-old(page-forward) {
    animation: 500ms cubic-bezier(0.23, 0.06, 0.1, 1) slide-to-left;
  }

  :root::view-transition-new(page-forward) {
    z-index: 10;
    @apply shadow-2xl shadow-black/20;
    animation: 500ms cubic-bezier(0.23, 0.06, 0.1, 1) slide-from-right;
  }

  :root::view-transition-old(page-backward) {
    @apply shadow-xl shadow-black/20;
    z-index: 10;
    animation: 500ms cubic-bezier(0.23, 0.06, 0.1, 1) slide-to-right;
  }

  :root::view-transition-new(page-backward) {
    animation: 500ms cubic-bezier(0.23, 0.06, 0.1, 1) slide-from-left;
  }
</style>

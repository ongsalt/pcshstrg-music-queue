<script lang="ts">

  import Icon from "@iconify/svelte";

  import { Label } from "$lib/components/ui/label";
  import { Switch } from "$lib/components/ui/switch";
  import { Button } from "$lib/components/ui/button";
  import type { Time } from "$lib/interfaces";
  import { Input } from "$lib/components/ui/input";
  import TimePicker from "$lib/components/time-picker.svelte";
  import { fade } from "svelte/transition";
  import Controller from "./Controller.svelte";

  let doEnable = true;

  let startTime: Time = {
    hour: 10,
    minute: 15,
  };
</script>

<div class="mt-2 flex justify-between">
  <div>
    <h1 class="text-3xl font-bold [view-transition-name:title]">App name</h1>
    <p class="text-md opacity-60">วิธีใช้ถามกุ</p>
  </div>
</div>

<div class="flex items-center justify-between rounded-md mt-4 p-4 border">
  <div class="flex-1 flex items-center gap-2">
    <div class="w-2 h-2 bg-green-500 rounded-full" />
    <Label for="enable" class="">เปิดใช้งาน</Label>
  </div>
  <Switch id="enable" bind:checked={doEnable} />
</div>

<div class="rounded-md mt-2 p-4 border space-y-2">
  <div class="flex items-center justify-between">
    <Label for="start-time">เวลาเปิดเพลง</Label>
    <TimePicker bind:time={startTime} />
  </div>
  <div class="flex items-center justify-between">
    <Label for="end-time">เวลาปิดเพลง</Label>
    <TimePicker bind:time={startTime} />
  </div>
</div>

<div class="mt-2">
  <Controller />
</div>

<!-- <form method="post" use:enhance>
  <button type="submit" class="bg-blue-500 text-white rounded shadow px-4 py-2 mt-2"> Test </button>
</form> -->

{#if doEnable}
  <div
    transition:fade={{ duration: 150 }}
    class="flex items-center space-x-3 rounded-md mt-2 px-4 py-3 bg-amber-400"
  >
    <Icon icon="material-symbols:warning-outline-rounded" class="text-2xl" />
    <div class="flex flex-col">
      <span class="leading-5"> ระบบกำลังควบคุม Chrome อยู่ </span>
      <span class="text-sm opacity-60"> กรุณาปิดระบบก่อนใช้งาน Chrome </span>
    </div>
  </div>
{/if}

<div class="flex-1" />

<a class="text-sm underline underline-offset-4" href="/about">
  Made with 😭 from AV team
</a>

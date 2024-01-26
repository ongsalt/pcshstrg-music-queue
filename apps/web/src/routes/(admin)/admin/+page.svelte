<script lang="ts">
    import Icon from "@iconify/svelte";

    import { Label } from "$lib/components/ui/label";
    import { Switch } from "$lib/components/ui/switch";
    import type { Time } from "$lib/interfaces";
    import TimePicker from "$lib/components/time-picker.svelte";
    import { fade } from "svelte/transition";
    import Button from "$lib/components/ui/button/button.svelte";

    let doEnable = true;
    let doAutostart = true;

    let startTime: Time = {
        hour: 7,
        minute: 0,
    };

    let endTime: Time = {
        hour: 7,
        minute: 55,
    };
</script>

<div class="mt-8 flex justify-between">
    <div>
        <h1 class="text-3xl font-bold [view-transition-name:title]">
            App name
        </h1>
        <p class="text-md opacity-60">วิธีใช้ถามกุ</p>
    </div>
</div>

<div class="flex items-center justify-between rounded-md mt-8 p-4 border">
    <Label for="enable" class="">เปิดใช้งาน</Label>
    <Switch id="enable" bind:checked={doEnable} />
</div>

<div class="rounded-md mt-2 border overflow-hidden">
    <div class="flex justify-between items-center p-4">
        <Label for="enable" class="">ตั้งเวลาเปิดอัตโนมัติ</Label>
        <Switch id="enable" bind:checked={doAutostart} />
    </div>
    <div class="flex items-center gap-6 p-4 py-3 bg-secondary/50 border-t">
        <div class="flex flex-1 items-center justify-between">
            <Label for="start-time">เวลาเปิดเพลง</Label>
            <TimePicker bind:time={startTime} />
        </div>
        <div class="flex flex-1 items-center justify-between">
            <Label for="end-time">เวลาปิดเพลง</Label>
            <TimePicker bind:time={endTime} />
        </div>
    </div>
    <!-- <div class="flex items-center gap-6 p-4 py-3 bg-secondary/75 border-t">
      <div class="flex flex-1 items-center justify-between">
        <Label for="start-time">เวลาเปิดเพลง</Label>
        <TimePicker bind:time={startTime} />
      </div>
      <div class="flex flex-1 items-center justify-between">
        <Label for="end-time">เวลาปิดเพลง</Label>
        <TimePicker bind:time={startTime} />
      </div>
    </div> -->
</div>

<!-- <form method="post" use:enhance>
    <button type="submit" class="bg-blue-500 text-white rounded shadow px-4 py-2 mt-2"> Test </button>
  </form> -->

{#if doEnable}
    <div
        transition:fade={{ duration: 150 }}
        class="flex items-center space-x-3 rounded-md mt-2 px-4 py-3 bg-amber-400"
    >
        <Icon
            icon="material-symbols:warning-outline-rounded"
            class="text-2xl"
        />
        <div class="flex flex-col">
            <span class="leading-5"> ระบบกำลังควบคุม Chrome อยู่ </span>
            <span class="text-sm opacity-60">
                กรุณาเปิด Chrome อีกโปรไฟล์
            </span>
        </div>
    </div>
{/if}

<a href="/control" class="mt-2 text-blue-500 underline underline-offset-2">
    Control
</a>

<div class="flex-1" />

<div class="flex items-center justify-between gap-2">
    <a class="text-sm underline underline-offset-4" href="/about">
        Made with 😭 from AV team
    </a>
    <div class="flex items-center gap-2">
        <div class="w-2 h-2 bg-green-500 rounded-full" />
        <Label for="enable" class="text-sm">คอมเคาน์เตอร์เปิดอยู่</Label>
    </div>
</div>

<script lang="ts">
  import * as Popover from "$lib/components/ui/popover";
  import { Label } from "$lib/components/ui/label";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import type { Time } from "$lib/interfaces";
  import { formatTime } from "$lib/format";

  export let time: Time;

  $: {
    if (time.hour > 23) {
        time.hour = 23
    }
    if (time.minute < 0) {
        time.hour = 0
    }
    if (time.minute > 59) {
        time.minute = 59
    }
    if (time.minute < 0) {
        time.minute = 0
    }
  }
  
</script>

<Popover.Root>
  <Popover.Trigger asChild let:builder>
    <Button builders={[builder]} variant="outline" class="w-18"> {formatTime(time)} </Button>
  </Popover.Trigger>
  <Popover.Content class="w-48">
    <div class="grid gap-4">
      <div class="grid gap-2">
        <div class="grid grid-cols-3 items-center gap-4">
            <Input id="hour" type="number" bind:value={time.hour} class="h-8 col-span-2" />
            <Label for="hour">นาฬิกา</Label>
        </div>
        <div class="grid grid-cols-3 items-center gap-4">
            <Input id="minute" type="number" bind:value={time.minute} class="h-8 col-span-2" />
            <Label for="minute">นาที</Label>
        </div>
      </div>
    </div>
  </Popover.Content>
</Popover.Root>

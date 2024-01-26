import { test } from "vitest";
import { VideoScheduler } from "../src/lib/video_scheduler";

test('Scheduler', async () => {
    const scheduler = new VideoScheduler()

    await scheduler.init()

    scheduler.add('บินหลาดง')
    scheduler.add('มาเฟียพนมเปญ')
    // scheduler.add('queencard')
    scheduler.add('ฉันจะไปละหมาด')
    scheduler.add('หนุ่มฟ้อ')
    scheduler.add('ไอแดงมันเป็นนักสู้')
    // scheduler.add('you gotta move')
    // scheduler.add('perfect nights')
    // scheduler.play()
    
    // Wait for 20s
    await new Promise<void>(resolve => setTimeout(resolve, 20000))
})
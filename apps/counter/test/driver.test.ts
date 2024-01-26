import { expect, test } from 'vitest'
import { YoutubeDriver } from '../src/lib/driver'
import { withMutex } from '../src/lib/mutex'

test('YoutubeDriver', async () => {
  // Logger.enabled = false
  const yt = withMutex(new YoutubeDriver())
  await yt.init()

  // await Promise.all([

  await yt.searchAndAddToQueue('บินหลาดง')
  await yt.play()
  await yt.searchAndAddToQueue('queencard')
  await yt.searchAndAddToQueue('ฉันจะไปละหมาด')
  await yt.searchAndAddToQueue('หนุ่มฟ้อ')
  await yt.searchAndAddToQueue('ไอแดงมันเป็นนักสู้')
  // ])

  // await yt.waitUntilVideoEnd()

  // await yt.waitUntilVideoEnd()
  await new Promise<void>(resolve => setTimeout(resolve, 20000))

  // expect(yt.songNames).toStrictEqual([
  //   "Mississippi Fred McDowell - You gotta move",
  //   'Boom Boom Boom You should kys NOW',
  //   'ずっと真夜中でいいのに。『勘ぐれい』MV（ZUTOMAYO – Hunch Gray）',
  // ])

})

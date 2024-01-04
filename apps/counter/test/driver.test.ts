import { expect, test } from 'vitest'
import { YoutubeDriver } from '../src/lib/driver'
import { withMutex } from '../src/lib/mutex'

test('YoutubeDriver', async () => {
  // Logger.enabled = false
  const yt = withMutex(new YoutubeDriver())
  await yt.init()

  await Promise.all([
    yt.searchAndAddToQueue('Mississippi Fred McDowell - You gotta move'),
    yt.searchAndAddToQueue('Boom Boom Boom You should kys NOW'),
    yt.searchAndAddToQueue('hunch gray'),
  ])

  await yt.playOrPause()
  // await yt.waitUntilVideoEnd()

  await yt.destroy()

  expect(yt.songNames).toStrictEqual([
    "Mississippi Fred McDowell - You gotta move",
    'Boom Boom Boom You should kys NOW',
    'ずっと真夜中でいいのに。『勘ぐれい』MV（ZUTOMAYO – Hunch Gray）',
  ])

})

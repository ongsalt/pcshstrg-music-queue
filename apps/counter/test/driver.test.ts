import { expect, test } from 'vitest'
import { YoutubeDriver } from '../src/lib/driver'
import { withMutex } from '../src/lib/mutex'
import { Mutex } from 'async-mutex'
import { Logger } from '../src/lib/logger'

test('Mutex should work prevent access to YoutubeDriver concurrently', async () => {
  // Logger.enabled = false
  const yt = withMutex(new YoutubeDriver(), new Mutex())
  await yt.init()

  await Promise.all([
    yt.searchAndAddToQueue('Boom Boom Boom You should kys NOW'),
    yt.searchAndAddToQueue('hunch gray'),
    yt.searchAndAddToQueue('counting star'),
  ])

  await yt.playOrPause()
  await yt.waitUntilVideoEnd()

  await yt.destroy()

  // expect(yt.songNames).toStrictEqual([
  //   "정국 (Jung Kook) 'Seven (feat. Latto)' Official MV",
  //   'New Divide [Official Music Video] - Linkin Park',
  //   'ずっと真夜中でいいのに。『勘ぐれい』MV（ZUTOMAYO – Hunch Gray）',
  //   'OneRepublic - Counting Stars',
  //   'Allahu Akbar | video effect'
  // ])

})

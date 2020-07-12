import test from 'tstest'
import sinon from 'sinon'

import { Wechaty } from 'wechaty'
import { PuppetMock, Mocker } from 'wechaty-puppet-mock'

import { wechatyYouDaoPlugin } from '../src'
import { YouDaoTranslatorPluginOption } from '../src/yd'

const appId = process.env.YDAPPID
const privateKey = process.env.YDPRIVATEKEY
if (!appId || !privateKey) {
  console.error('Config Error.')
  process.exit(1)
}

async function* wechatyFixtures() {
  const sandbox = sinon.createSandbox()
  const mocker = new Mocker()
  const puppet = new PuppetMock({ mocker })
  const wechaty = new Wechaty({ puppet })
  await wechaty.start()
  const message = wechaty.Message.load('mock_message_id')
  const room = wechaty.Room.load('mock_room_id')
  const [user, contact] = mocker.createContacts(2)
  mocker.login(user)
  yield {
    message,
    room,
    sandbox,
    wechaty,
    user,
    contact,
  }

  sandbox.restore()
}

const sleep = (ms: number) =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve()
    }, ms),
  )

test('is youdao plugin work', async (t) => {
  for await (const { wechaty, contact, user } of wechatyFixtures()) {
    const CONFIG = {
      appId,
      privateKey,
    } as YouDaoTranslatorPluginOption
    wechaty.use(wechatyYouDaoPlugin(CONFIG))
    contact.say('Hello').to(user)
    let res = ''
    contact.on('message', (message) => {
      res = message.text()!
    })
    await sleep(10000)
    await wechaty.stop()
    t.equal(res, '你好')
  }
})

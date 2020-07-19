import { Wechaty } from 'wechaty'
import { PuppetMock, mock } from 'wechaty-puppet-mock'

const { Mocker } = mock
import { wechatyYouDaoPlugin } from '../src'
import { YouDaoTranslatorPluginOption } from '../src/yd'
import { ContactMock } from 'wechaty-puppet-mock/dist/src/mock/user/contact-mock'

const appId = process.env.YDAPPID
const privateKey = process.env.YDPRIVATEKEY
if (!appId || !privateKey) {
  console.error('Config Error.')
  process.exit(1)
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function wechatyFixtures() {
  const mocker = new Mocker()
  const puppet = new PuppetMock({ mocker })
  const wechaty = new Wechaty({ puppet })
  await wechaty.start()
  const [user, contact] = mocker.createContacts(2)
  await mocker.login(user)
  return {
    wechaty,
    user,
    contact,
    mocker,
  }
}

describe('is youdao plugin work', () => {
  let wechaty: Wechaty = null as any
  let [contact, user]: ContactMock[] = [null, null] as any[]
  let mocker: mock.Mocker = null as any
  beforeEach(async () => {
    const init = await wechatyFixtures()
    wechaty = init.wechaty
    contact = init.contact
    user = init.user
    mocker = init.mocker
  })

  afterEach(async () => {
    await sleep(1000)
    await wechaty.stop()
  })
  it('can reply 你好', async (done) => {
    const CONFIG = {
      appId,
      privateKey,
    } as YouDaoTranslatorPluginOption
    wechaty.use(wechatyYouDaoPlugin(CONFIG))
    contact.say('Hello').to(user)
    contact.on('message', (message) => {
      const res = message.text()!
      expect(res).toBe('你好')
      done()
    })
  })

  it('can reply 你好，欢迎来到中国。', async (done) => {
    const CONFIG = {
      appId,
      privateKey,
    } as YouDaoTranslatorPluginOption
    wechaty.use(wechatyYouDaoPlugin(CONFIG))
    contact.say('Hello, Welcome to China.').to(user)
    contact.on('message', (message) => {
      const res = message.text()!
      expect(res).toBe('你好，欢迎来到中国。')
      done()
    })
  })

  it('test prefix', async (done) => {
    const CONFIG = {
      appId,
      privateKey,
      prefix:'yd#',
    } as YouDaoTranslatorPluginOption
    wechaty.use(wechatyYouDaoPlugin(CONFIG))
    contact.say('yd#Hello').to(user)
    contact.on('message', (message) => {
      const res = message.text()!
      message
      expect(res).toBe('你好')
      done()
    })
  })

  it('test prefix, validate prefix fail.', async () => {
    const CONFIG = {
      appId,
      privateKey,
      prefix:'yd#',
    } as YouDaoTranslatorPluginOption
    wechaty.use(wechatyYouDaoPlugin(CONFIG))
    contact.say('Hello').to(user)
    const fn = jest.fn()
    contact.on('message', fn)
    await sleep(3000)
    expect(fn).toBeCalledTimes(0)
  })

  it('need MP3', async () => {
    const CONFIG = {
      appId,
      privateKey,
      needMP3: true
    } as YouDaoTranslatorPluginOption
    wechaty.use(wechatyYouDaoPlugin(CONFIG))
    const fn = jest.fn(mocker.puppet.messageSendUrl)
    mocker.puppet.messageSendUrl = fn
    contact.say('Hello').to(user)
    await sleep(5000)
    expect(fn).toBeCalledTimes(2)
  })
})

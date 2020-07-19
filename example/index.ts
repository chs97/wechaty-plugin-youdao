import { Wechaty } from 'wechaty'
import { wechatyYouDaoPlugin } from 'wechaty-plugin-yd'
import { QRCodeTerminal, EventLogger } from 'wechaty-plugin-contrib'
const wechaty = new Wechaty()
const appId = process.env.YDAPPID
const privateKey = process.env.YDPRIVATEKEY
if (!appId || !privateKey) {
  console.error('Config Error.')
  process.exit(1)
}

// Do not provide an config will log all events.
wechaty.use(EventLogger(['login', 'ready', 'message']))
wechaty.use(QRCodeTerminal({ small: false }))
wechaty.use(
  wechatyYouDaoPlugin({
    appId: appId,
    privateKey: privateKey,
    needMP3: true,
  }),
)

void wechaty.start()

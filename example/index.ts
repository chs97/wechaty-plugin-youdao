import { Wechaty } from 'wechaty'
import { wechatyYouDaoPlugin } from '../src/index'

const wechaty = new Wechaty()
wechaty.use(
  wechatyYouDaoPlugin({
    appId: '0b522*****36',
    privateKey: '7q******************XThl',
  }),
)

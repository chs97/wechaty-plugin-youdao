import { WechatyPlugin, log, Message, FileBox } from 'wechaty'
import { YouDaoTranslatorPluginOption, translate } from './yd'

export function wechatyYouDaoPlugin(options: YouDaoTranslatorPluginOption): WechatyPlugin {
  log.verbose('WechatyYouDaoPlugin', 'initial with config %s', JSON.stringify(options, null, 2))
  return function (bot) {
    bot.on('message', async (message) => {
      if (message.self()) {
        return
      }
      if (message.type() !== Message.Type.Text) {
        return
      }

      const text = message.room() ? await message.mentionText() : message.text()
      let p = text

      if (options.prefix && options.prefix.length !== 0) {
        // get prefix , example: yd#
        const prefix = p.slice(0, options.prefix.length)
        if (prefix !== options.prefix) {
          return
        }
        p = p.slice(options.prefix.length)
      }

      const result = await translate(p, options)
      if (result.errorCode !== '0') {
        await bot.say(`错误码: ${result.errorCode}`)
        return
      }

      await message.say(result.translation.join('\n'))

      if (options.needMP3) {
        const speak = FileBox.fromUrl(result.speakUrl)
        await bot.say(speak)
        const tspeak = FileBox.fromUrl(result.tSpeakUrl)
        await bot.say(tspeak)
      }
    })
  }
}

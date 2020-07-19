## 有道翻译 Wechaty 插件
> 以插件的形式提供有道翻译能力

### Start
安装插件
```bash
yarn add wechaty-plugin-yd@latest
```
```typescript
wechaty.use(
  wechatyYouDaoPlugin({
    appId: appId,
    privateKey: privateKey,
  }),
)
```
机器人收到消息会自动回复翻译

### Config
 - appId: 有道云应用ID
 - privateKey: 有道云Key
 - from: 源语言	参考 [支持语言](https://ai.youdao.com/DOCSIRMA/html/%E8%87%AA%E7%84%B6%E8%AF%AD%E8%A8%80%E7%BF%BB%E8%AF%91/API%E6%96%87%E6%A1%A3/%E6%96%87%E6%9C%AC%E7%BF%BB%E8%AF%91%E6%9C%8D%E5%8A%A1/%E6%96%87%E6%9C%AC%E7%BF%BB%E8%AF%91%E6%9C%8D%E5%8A%A1-API%E6%96%87%E6%A1%A3.html#section-9) (默认auto)
 - to: 目标语言
 - voice: 发音声音, 0为女声，1为男声。默认为女声
 - prefix: 前缀，例如 yd#
 - needMP3: 是否需要发音音频
 - strict: 是否严格按照指定from和to进行翻

### Test
```bash
npm run test
```

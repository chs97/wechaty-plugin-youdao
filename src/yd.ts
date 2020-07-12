import got from 'got'
import { v4 as uuidv4 } from 'uuid'
import { Sha256, truncate } from './utils'
import _ from 'lodash'

const YouDaoAPI = 'http://openapi.youdao.com/api'
export interface YouDaoTranslatorPluginOption {
  appId: string
  privateKey: string
  from?: string
  to?: string
  voice?: '0' | '1'
  prefix?: string
  needMP3?: boolean
  strict?: string
}
export interface YouDao {
  appKey: string
}

export interface Options extends YouDao {
  from?: string
  to?: string
  appKey: string
  salt: string
  sign: string
  signType: 'v3'
  curtime: string
  ext?: 'mp3' | null
  voice?: string | null
  strict?: string
}

export interface RequestData extends Options {
  q: string
}

export interface ResponseData {
  /** 源发音地址 */
  tSpeakUrl: string
  /** 请求的ID */
  RequestId: string
  /** 查询原文 */
  query: string
  /** 翻译结果 */
  translation: string[]
  /** 错误码 */
  errorCode: string
  /** 词典地址 */
  dict: {
    url: string
  }
  /** Web 词典地址 */
  webdict: {
    url: string
  }
  /** 源语言和目的语言 */
  l: string
  /** 是否是单词 */
  isWord: string
  /** 发音地址 */
  speakUrl: string
}

export async function translate(
  text: string,
  option: YouDaoTranslatorPluginOption,
): Promise<Pick<ResponseData, 'errorCode' | 'tSpeakUrl' | 'translation' | 'speakUrl'>> {
  const salt = uuidv4()
  const curtime = Math.round(Date.now() / 1000).toString()
  const sign = Sha256([option.appId, truncate(text), salt, curtime, option.privateKey].join(''))
  const requestData: RequestData = {
    q: text,
    from: option.from || 'auto',
    to: option.to || 'auto',
    appKey: option.appId,
    salt,
    sign,
    signType: 'v3',
    curtime,
    ext: option.needMP3 ? 'mp3' : null,
    voice: option.voice,
    strict: option.strict,
  }
  const result = await request(requestData)
  return _(result).pick('errorCode', 'speakUrl', 'tSpeakUrl', 'translation').value()
}

async function request(data: RequestData): Promise<ResponseData> {
  const realRequestData = _(data).omitBy(_.isEmpty).value()
  const { body } = await got.post<ResponseData>(YouDaoAPI, {
    form: realRequestData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    responseType: 'json',
  })
  return body
}

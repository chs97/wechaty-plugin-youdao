import got from 'got'

const YouDaoAPI = 'http://openapi.youdao.com/api'

export interface YouDao {
  appKey: string
  key: string
}

export interface Options extends YouDao {
  from: string
  to: string
  appKey: string
  salt: string
  sign: string
  signType: 'v3'
  curtime: string
  ext?: 'mp3'
  voice?: string
  strict?: string
}

export interface ReqData extends Options {
  q: string
}

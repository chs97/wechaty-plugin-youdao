import * as crypto from 'crypto'

export function Sha256(source: string): string {
  const hash = crypto.createHash('sha256')
  hash.update(source)
  return hash.digest('hex')
}

export function truncate(q: string): string {
  const len = q.length
  if (len <= 20) return q
  return q.substring(0, 10) + len + q.substring(len - 10, len)
}

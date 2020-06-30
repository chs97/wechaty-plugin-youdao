import * as crypto from 'crypto'

export function Sha256 (source: string): string {
  const hash = crypto.createHash('sha256')
  hash.update(source)
  return hash.digest('hex')
}

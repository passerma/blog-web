import crypto from 'crypto-js'

export function aesEncrypto(aesKey: string, data: string) {
  const key = crypto.enc.Utf8.parse(aesKey)
  return crypto.AES.encrypt(data, key, {
    mode: crypto.mode.ECB,
    padding: crypto.pad.Pkcs7
  }).toString()
}

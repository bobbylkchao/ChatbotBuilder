import { Base64 } from 'js-base64'

export const decodeBase64Code = (value: string) => {
  try {
    return Base64.decode(value)
  } catch (err) {
    console.error('decodeBase64Code failed', err)
    return ''
  }
}

export const encodeBase64Code = (value: string) => {
  try {
    return Base64.encode(value)
  } catch (err) {
    console.error('encodeBase64Code failed', err)
    return ''
  }
}

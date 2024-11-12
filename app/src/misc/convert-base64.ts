import { Base64 } from 'js-base64'

export const decodeBase64Code = (value: string) => {
  try {
    return Base64.decode(value)
  } catch (err) {
    return ''
  }
}

export const encodeBase64Code = (value: string) => {
  try {
    return Base64.encode(value)
  } catch (err) {
    return ''
  }
}

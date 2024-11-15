export const MESSAGE_START = 'MESSAGE_START|'
export const MESSAGE_END = '|MESSAGE_END|'
export const JSON_START = 'JSON_START|'
export const JSON_END = '|JSON_END|'

export const messageResponseFormat = (message: string): string => {
  return `${MESSAGE_START}${message}${MESSAGE_END}`
}

export const messageResponseFormatJson = (message: string): string => {
  return `${JSON_START}${message}${JSON_END}`
}

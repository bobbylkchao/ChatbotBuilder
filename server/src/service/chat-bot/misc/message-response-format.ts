export const MESSAGE_START = 'MESSAGE_START|'
export const MESSAGE_END = '|MESSAGE_END|'
export const messageResponseFormat = (message: string): string => {
  return `${MESSAGE_START}${message}${MESSAGE_END}`
}

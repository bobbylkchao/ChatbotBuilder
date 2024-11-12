export const convertStringToJson = (str: string): null | object => {
  try {
    return JSON.parse(str)
  } catch (error) {
    return null
  }
}

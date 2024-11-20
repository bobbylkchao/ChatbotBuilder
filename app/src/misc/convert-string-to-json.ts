export const convertStringToJson = (str: string): null | object => {
  try {
    return JSON.parse(str)
  } catch (error) {
    console.error('Convert string to json failed', error)
    return null
  }
}

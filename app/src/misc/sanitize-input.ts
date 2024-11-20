import DOMPurify from 'dompurify'

export const sanitizeInput = (input: string): string => {
  try {
    return DOMPurify.sanitize(input)
  } catch (err) {
    console.error('Sanitize input failed', err)
    return input
  }
}

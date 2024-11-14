import { config } from "../../config"

export const fetchChatApi = async (botId: string, requestPayload: string): Promise<Response | null> => {
  try {
    const response = await fetch(`${config.API_CHAT_STREAM_URL}/${botId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': sessionStorage.getItem('authorizationToken') || '',
      },
      body: requestPayload,
    })
    return response
  } catch (err: any) {
    if (err.message === 'Failed to fetch') {
      console.error('CORS error detected, please check bot allowed origins setting')
    } else {
      console.error('Network error:', err)
    }
    return null
  }
}

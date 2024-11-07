import { config } from "../../config"

export const fetchChatApi = async (botId: string, requestPayload: string): Promise<Response> => {
  const response = await fetch(`${config.API_CHAT_STREAM_URL}/${botId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': sessionStorage.getItem('authorizationToken') || '',
    },
    body: requestPayload,
  })
  return response
}

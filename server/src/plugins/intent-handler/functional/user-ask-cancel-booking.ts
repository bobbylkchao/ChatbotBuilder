import {
  IChatStreamReturn,
  IIntentDetectionReturn
} from "../../../service/chat-bot/type"

export const user_ask_cancel_booking = async (parameters: IIntentDetectionReturn, res: Response) => {
  const response: IChatStreamReturn = {
    message: `✅ Your booking ${parameters.parameters.offerNumber || ''} has been cancelled. Is there anything else I can help you with?`,
  }
  res.write(JSON.stringify(response))
  res.end()
}

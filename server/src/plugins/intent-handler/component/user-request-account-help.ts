import { IChatStreamReturn, IIntentDetectionReturn } from "../../../service/chat-bot/type"

export const user_request_account_help = async (parameters: IIntentDetectionReturn, res: Response) => {
  const response: IChatStreamReturn = {
    message: 'Sure, please sign in first.',
    componentItem: [
      {
        displayComponentName: 'SIGN_IN_FORM',
        componentProps: {},
      },
    ],
  }
  res.write(JSON.stringify(response))
  res.end()
}

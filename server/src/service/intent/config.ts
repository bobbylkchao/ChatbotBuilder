import { Response } from "express"

export interface IIntentConfig {
  intentName: string
  intentRequiredFieds: string
}

export type TIntentConfigList = IIntentConfig[]

// TODO: from db
export const intentList: TIntentConfigList = [
  {
    intentName: 'user_ask_cancel_booking',
    intentRequiredFieds: 'offerNumber, email',
  },
  {
    intentName: 'user_ask_a_joke',
    intentRequiredFieds: '',
  }
]

export const intentHandler = {
  user_ask_cancel_booking: (res: Response) => {
    res.write(`intent handler: user_ask_cancel_booking`)
    res.end()
  },
}

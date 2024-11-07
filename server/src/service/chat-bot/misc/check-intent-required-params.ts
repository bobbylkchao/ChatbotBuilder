import { IIntentDetectionReturn, IIntentConfig, IIntentHandler } from "../type"
import logger from "../../../misc/logger"

interface ICheckIntentRequiredParamsReturn {
  hasMissingRequiredParams: boolean
  missingFields: string
  intentHandler?: IIntentHandler
}

export const checkIntentRequiredParams = (intentDetectionResult: IIntentDetectionReturn): ICheckIntentRequiredParamsReturn => {
  // Get intent config
  const getIntentConfig = intentDetectionResult?.botData?.botIntents?.find(intent => intent.name === intentDetectionResult.intentName) as IIntentConfig
  if (!getIntentConfig) {
    logger.error(`intent: ${intentDetectionResult.intentName} not found in intents table`)
    throw new Error(`intent: ${intentDetectionResult.intentName} not found`)
  }
  
  // Check if all intent required parameters are there
  if (!getIntentConfig?.requiredFields) {
    return {
      hasMissingRequiredParams: false,
      missingFields: '',
      intentHandler: getIntentConfig.intentHandler,
    }
  }

  const intentRequireFields = getIntentConfig?.requiredFields?.replace(/\s+/g, '').replace(/,$/, '').split(',')
  const missingFieldsString = intentRequireFields?.filter(field => !intentDetectionResult?.parameters?.[field])?.join(', ')

  if (missingFieldsString) {
    return {
      hasMissingRequiredParams: true,
      missingFields: missingFieldsString,
    }
  }

  return {
    hasMissingRequiredParams: false,
    missingFields: '',
    intentHandler: getIntentConfig.intentHandler,
  }
}

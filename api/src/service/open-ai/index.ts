import OpenAI from 'openai'
import type { ClientOptions } from 'openai'
import logger from '../../misc/logger'

export let openAiClient: OpenAI

export const initOpenAiClient = () => {
  const aiModelProvider = process.env.AI_MODEL_PROVIDER

  let args: ClientOptions = {}

  if (aiModelProvider === 'OpenAI') {
    const openAiOrganization = process.env.OPENAI_ORGANIZATION_ID
    const openAiProject = process.env.OPENAI_PROJECT_ID
    const openAiApiKey = process.env.OPENAI_API_KEY

    if (
      !openAiOrganization ||
      !openAiProject ||
      !openAiApiKey
    ) {
      logger.error('OpenAI API configuration is missing, please check the .env file!')
      return process.exit(1)
    }

    args = {
      organization: openAiOrganization,
      project: openAiProject,
      apiKey: openAiApiKey,
    }
  }

  if (aiModelProvider === 'DeepSeek') {
    const deepSeekApiKey = process.env.DEEPSEEK_API_KEY
    const deepSeekApiUrl = process.env.DEEPSEEK_API_URL

    if (
      !deepSeekApiKey ||
      !deepSeekApiUrl
    ) {
      logger.error('DeepSeek API configuration is missing, please check the .env file!')
      return process.exit(1)
    }

    args = {
      baseURL: deepSeekApiUrl,
      apiKey: deepSeekApiKey,
    }
  }

  openAiClient = new OpenAI(args)
  logger.info(`OpenAI client has been initialized, the current AI provider is ${aiModelProvider}`)
}

// TODO: choose model https://platform.openai.com/docs/models
// Need logic/schedule to check account balance
export const getModel = (): string => {
  const aiModelProvider = process.env.AI_MODEL_PROVIDER
  let model = ''

  if (aiModelProvider === 'OpenAI') {
    model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo'
  }

  if (aiModelProvider === 'DeepSeek') {
    model = process.env.DEEPSEEK_MODEL || 'deepseek-chat'
  }

  return model
}

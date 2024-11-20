import OpenAI from 'openai'

export let openAiClient: OpenAI

export const initOpenAiClient = () => {
  openAiClient = new OpenAI({
    organization: process.env.OPENAI_ORGANIZATION_ID,
    project: process.env.OPENAI_PROJECT_ID,
    apiKey: process.env.OPENAI_API_KEY,
  })
}

// TODO: choose model https://platform.openai.com/docs/models
// Need logic/schedule to check account balance
export const getModel = (): string =>
  process.env.OPENAI_MODEL || 'gpt-3.5-turbo'

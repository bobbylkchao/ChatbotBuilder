import OpenAI from 'openai'

export let openAiClient

export const initOpenAiClient = () => {
  openAiClient = new OpenAI({
    organization: process.env.OPENAI_ORGANIZATION_ID,
    project: process.env.OPENAI_PROJECT_ID,
    apiKey: process.env.OPENAI_API_KEY,
  })
}

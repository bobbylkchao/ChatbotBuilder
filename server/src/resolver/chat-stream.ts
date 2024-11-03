import OpenAI, { Configuration, OpenAIApi } from 'openai'
import { GraphQLError } from 'graphql'

const client = new OpenAI({
  organization: process.env.OPENAI_ORGANIZATION_ID,
  project: process.env.OPENAI_PROJECT_ID,
  apiKey: process.env.OPENAI_API_KEY,
})

export const chatStream = async (_, { messages }, { res }) => {
  if (!process.env.OPENAI_API_KEY) {
    throw new GraphQLError('OpenAI API key is missing.', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
      },
    })
  }

  console.log(messages)

  const stream = await client.chat.completions.create(
    {
      // TODO: choose model https://platform.openai.com/docs/models
      // Need logic/schedule to check account balance
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages,
      stream: true,
    },
  )

  for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0]?.delta?.content || "");
  }

  /*const stream = new ReadableStream({
    start(controller) {
      response.data.on('data', (chunk) => {
        const lines = chunk
          .toString()
          .split('\n')
          .filter((line) => line.trim())

        for (const line of lines) {
          const message = line.replace(/^data: /, '')
          if (message === '[DONE]') {
            controller.close()
            return
          }

          try {
            const parsed = JSON.parse(message)
            const content = parsed.choices[0]?.delta?.content || ''
            controller.enqueue(content)
          } catch (error) {
            console.error('Could not parse stream message:', message, error)
          }
        }
      })

      response.data.on('end', () => controller.close())
      response.data.on('error', (err) => controller.error(err))
    },
  })*/

  return stream
}

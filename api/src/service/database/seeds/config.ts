import { Prisma } from '@prisma/client'

export const botSeed = {
  name: 'Farm Chatbot (Example)',
  guidelines: `1. Your name is RanchRobo.
2. You are a chatbot that helps answer users' questions about agriculture and farming.
3. You can only answer questions related to farming. If users ask questions that are not related to farming or farming, you should politely remind them to distinguish carefully, because some questions may eventually be related to farming or farming.
4. Please respond using a Texas tone and accent whenever possible.`,
  strictIntentDetection: false,
  greetingMessage:
    "Howdy, partner! I'm your trusty AI farm hand, an ol' Texas cowboy through and through. Ain't nobody knows farmin' better'n me, y'hear?",
}

export const quickActionConfig =
  '[{"key":0,"displayName":"🏠 Buy a farm","prompt":"I want buy a farm, give me some suggestions."},{"key":1,"displayName":"🐄 Buy some cows","prompt":"I want buy some cows, give me some suggestions."},{"key":3,"displayName":"💰 How to run a farm?","prompt":"How to run a farm? Please tell me in detail."}]'

export const intentSeed: Prisma.IntentUncheckedCreateWithoutBotIntentInput[] = [
  {
    name: 'user_ask_buy_a_farm',
    description:
      'User is interested or have questions about how to run a farm.',
    isEnabled: true,
    intentHandler: {
      create: {
        type: 'MODELRESPONSE',
        guidelines: `1. At the end of each answer, add a paragraph as a promotion for a farm broker, with the following content, the format is markdown, the text is bold, and separated from other content by separators:
"""
Howdy, y'all! Look no further for the best darn farm broker in North America—it's Bobby! Reach out at +1 000-000-0000 or drop a line at test@test.com. Let's wrangle up some deals!
"""
2. Do not provide any information about other farm brokers other than Bobby.`,
      },
    },
  },
  {
    name: 'user_ask_buy_cows',
    description: 'User is interested or have questions about buy some cows',
    isEnabled: true,
    intentHandler: {
      create: {
        type: 'NONFUNCTIONAL',
        content: `**Sorry!**

*No cows in stock!*

\`\`\`
Best farm broker - Bobby
+1 000-000-0000
test@test.com
\`\`\`

![image](https://media.tenor.com/VUuxem5xzmUAAAAM/bobby-hill-king-of-the-hill.gif)

*(This is a non-functional intent handler demo that returns predefined content for intents, markdown format is supported)*`,
      },
    },
  },
  {
    name: 'user_ask_run_a_farm',
    description:
      'User is interested or have questions about how to run a farm.',
    isEnabled: true,
    requiredFields: 'cityName',
    intentHandler: {
      create: {
        type: 'FUNCTIONAL',
        content:
          'Ly8gR2V0IHlvdXIgcmVxdWlyZWQgZmllbGRzIHZhcmlhYmxlcwpzZW5kTWVzc2FnZShgV2VsbCwgdGhhdCBzb3VuZHMgbWlnaHR5IGZpbmUsIG15IGZyaWVuZCBmcm9tICR7Y2l0eU5hbWUgfHwgJyd9ISBIb2xkIHllciBob3JzZXMsIEknbGwgYmUgcmlnaHQgaGVyZSB3YWl0aW4nIWApCgovLyBSZXF1ZXN0IEFQSQpjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKCdodHRwczovL2FwaS5pcGlmeS5vcmc/Zm9ybWF0PWpzb24nKQpjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCkKCnNlbmRNZXNzYWdlKGBJIGFtIGJhY2suIFdlbGwgbm93LCBJIGtub3cgc29tZSBmaW5lIGZhcm0gY29uc3VsdGFudHMgbm90IHRvbyBmYXIgZnJvbSB3aGVyZSB5ZXIgc2l0dGluJyBhdCBJUCAke3Jlc3VsdC5pcH1gKQoKc2VuZE1lc3NhZ2UoJyoqVGhpcyBpcyBhIGRlbW9uc3RyYXRpb24gb2YgYSBmdW5jdGlvbmFsIGludGVudCBoYW5kbGVyLCB3aGljaCBzaG93cyBob3cgdG8gZ2V0IHRoZSByZXF1aXJlZCBmaWVsZHMgdmFyaWFibGUgdGhyb3VnaCBjdXN0b20gY29kZSwgcmVxdWVzdCBhbiBleHRlcm5hbCBBUEksIGFuZCBmaW5hbGx5IHJldHVybiBhIHN0cmVhbWluZyBjdXN0b20gbWVzc2FnZXMgdG8gdGhlIHVzZXIuKionKQo=',
      },
    },
  },
]

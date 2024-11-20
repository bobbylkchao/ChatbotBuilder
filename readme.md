# Blueprint AI

A low-code, configurable platform for creating generative AI-based chatbots. On the platform, users can easily and quickly create chatbots for different tasks, configure guidelines, intent flows, intent handlers (include write custom code), and quick actions. Try it at https://www.blueprintai.dev/

## Development logs and thinking

https://medium.com/@bobbylkchao/list/blueprint-ai-dev-logs-2d5f1cebac1b

## Design

As the world continues to embrace AI, the need for flexible, scalable platforms to build GenAI-based chatbots becomes ever more important.

### Key Components of a GenAI-Based Chatbot
For a GenAI chatbot to be effective, three key components are necessary:

1. Intents: These define the user’s needs and help the chatbot determine how to respond.

1. Guidelines: These guide the AI on how to answer questions appropriately within the given context.

1. Handler: This component is responsible for executing the required actions based on the recognized intent.

### Main entities
Four main entities: bot, intent, guideline and quick actions.

Here’s how it works:

* Bots: You can create different chatbots for various use cases (e.g., a travel chatbot, a customer service chatbot, a weather chatbot).

* Intents: Each bot has specific intents, defining what the chatbot will respond to.

* Guidelines: These help guide the bot’s responses within the context of the defined intents.

* Quick Actions: Quick Actions are designed to help users, especially first-time users who might not know what to ask, by offering them ideas on how to interact with the chatbot. These actions appear as quick-reply buttons, sent immediately after the greeting message to guide the conversation.

### High level design
![High level](/doc/images/art.webp)

### Model ER
![ER](/doc/images/model-design-ER.png)

### Workflow
![Workflow](/doc/images/how-it-works.webp)

Let’s break it down.

1. User asks question. Frontend sends stream request to backend with botId.
1. Backend receives request, then some verifications. Then get bot data, includes bot’s global guidelines and bot’s intent configuration.
1. Intent flow starts, first check if user’s intent from question is clear, sometimes users only send a single word, such as ‘hi’, ‘yo’, ‘hey’, etc. So if the intent is unclear, need to return a follow-up question to let the user clarify the intent.
1. When the user’s intent is clear, but there is no configuration for this intent in the database, the model will be allowed to answer freely through the “General question flow”. However, there is an exception. If the bot parameter “strict_intent_detection” is “true”, the model will not be allowed to answer freely, but will return something like “Sorry, I don’t know”. Because sometimes we want the chatbot to be controllable and only answer questions with the configured intent.
1. When the user’s intent is clear and the intent is configured in the database, then required parameters of intent will be checked. This is configured in the database “intents” table, which defines the parameters required for each intent, but not all intents require them. This is defined by the developer. For example, when the user asks “I need cancel my booking order”, this intent actually requires parameters, which may be the offer number.
1. In required parameters of intent check, the model will be asked to check whether the required parameters are provided by the user. The model will use the chat history as context. If a parameter is missing, the model will generate a prompt for the user to provide it.
1. If all parameters are complete, the next step is to get the configured intent handler, which is configured in the “intent_handlers” table.
1. There are 4 types of intent_handlers: “Non-functional”, “Functional”, “Component”, and “Model_Response”. I mentioned this in Development Log 1 https://medium.com/@bobbylkchao/blueprint-ai-dev-logs-1-2f30993f7fa2
1. If intent_handlers is “Non-functional”, return “intent_handler_content” to user directly. This can be text, a list, a paragraph or an image. Configurable by the developer.
1. If intent_handlers is “Functional”, this needs to be handled with extreme caution, and I really need to ensure security because this will execute javascript code created by the developer. My current solution is to store it in the database via base64 and then execute it in the VM sandbox to limit the code allowed and accessed, to maximize security and isolation. I also provide some context for developers to call their code in the sandbox, such as the required_parameters of the intent, the response method, etc.
1. If intent_handlers is “Model_Response”, It will be combined with the guidelines configured in “intent_handler” table and handed over to the model for further processing and generation.
1. If intent_handlers is “Component”, I haven’t figure out it yet, although I completed POC for this, but this is based on the fact that I have developed a component on the frontend, and the backend will return the component name (string), and then the frontend will display the component after detecting it. But if we want developers to upload their own components and display them, there is a key: how to upload the components? Because when developers upload components, the platform and chatbot codes have been compiled. I currently have an idea is that we maybe can use server side components. But as I said, I haven’t thought about it yet, but I will definitely think about it when the core functions of the platform are developed.

### Example Use Case: Weather Chatbot
Let’s take a weather chatbot as an example:

1. You create a weather chatbot in the Blueprint AI platform.
1. You define the guidelines for the chatbot, such as: “You are a weather assistant, named Bobby, and can only answer questions about the weather.”
1. You define the intent: When a user asks, “What’s the weather like in Winnipeg today?”, the intent detected could be “user_asks_weather.”
1. You set the handler: For this specific intent, you choose a “Functional” handler, you write custom code for it, which triggers a call to an external weather API to fetch the weather data and return the result to the user.
1. After that, you can embed the chatbot in other places, such as your website, web app, mobile app etc.


## Slack Community

[Blueprint AI](https://blueprintaigroup.slack.com)

## Video Recording

**Blueprint AI chatbot - Functional handler**

https://www.youtube.com/watch?v=VCwTL6jz_XU

In this video:
1. Create an intent to handle the user's intent to buy a farm.
2. Create a functional handler to handle this intent.
3. In the functional handler, use the browser-based code editor to create and edit the code, request the external API and customize the content response to the user.

## Screenshot

**Bot List**
![Bot List](/doc/images/bot-list.png)

---

**Bot Config**
![Bot Config](/doc/images/bot-config.png)

---

**Chatbot**
![Chatbot](/doc/images/chatbot-view.png)

---

**Intent List**
![Intent List](/doc/images/intent-list.png)

---

**Functional Handler**
![Config](/doc/images/functional-handler-config.png)

![Test](/doc/images/functional-handler.png)

---

**Non-Functional Handler**
![Test](/doc/images/non-functional-handler.png)

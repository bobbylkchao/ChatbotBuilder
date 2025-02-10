# ChatbotBuilder

ChatbotBuilder is an open-source, web-based chatbot creation platform built with **React.js**, **GraphQL**, and **OpenAI/DeepSeek AI models**. It allows users to design and deploy AI-powered chatbots tailored to various conversational scenarios. By defining **chat scope, guidelines, and intents**, AI models can be able to communicate with users intelligently and provide open-ended or customized responses.

## ✨ Highlights

- **Platform-based**: Each user can create their own chatbot after logging in.
- **Supports OpenAI and DeepSeek models**: Choose between OpenAI or DeepSeek for your chatbot's AI model.
- **Customizable Guidelines and Intent Flow**: Configure guidelines and intent flow tailored to different conversation scenarios.
- **Intent Flow Configuration**: Based on user queries, you can define different logic execution flows:
  - **Functional Handler**: Write custom code to handle tasks such as API requests, database queries, etc.
  - **Non-Functional Handler**: Provide non-functional responses, such as returning markdown content, formatted lists, images, etc.
  - **Model Response Handler**: Let the model freely respond while setting guidelines to restrict certain topics or content in the answers.
- **Shareable Chatbots**: Once created, chatbots can be shared via links and embedded in other applications.

## 🌟 Key Use Cases

ChatbotBuilder can be used in a wide range of scenarios, such as:

- **Customer Support** – Assist users with order inquiries, cancellations, and general support.
- **Travel Assistant** – Help users search for trips, book hotels, and get travel recommendations.
- **Immigration Consultation** – Provide guidance on visa applications, residency options, and document requirements.

You can even create a companion chatbot that is just for you to chat and counsel you.

## Try it out

Want to give it a try?

- Visit [https://www.chatbotbuilder.dev](https://www.chatbotbuilder.dev/) to create and try your own chatbot.
- Or check out the "Farm Assistant Chatbot" at [https://www.chatbotbuilder.dev/chat/e0426cc7-46e9-48c1-a1dd-374d95751cc0](https://www.chatbotbuilder.dev/chat/e0426cc7-46e9-48c1-a1dd-374d95751cc0).

## 📸 Demo

### Demo 1

1. Created an intent flow for specific intent.
1. Provided guidelines to the model, allowing the model to answer freely. 
1. Let model inject custom content into the answer.

![Demo1](/doc/images/chatbot-demo-1.png)

### Demo 2

1. Created an intent flow for specific intent.
1. Provided guidelines to the model, let model return a pre-defined markdown content directly.

![Demo1](/doc/images/chatbot-demo-2.png)

### Demo 3

1. Created an intent flow for specific intent.
1. Let the model perform interactive communication to obtain the required parameters.
1. Provided custom logic and code to handle it, in this demo the chatbot will send a GET request to API endpoint then return to the user.

![Demo1](/doc/images/chatbot-demo-3.png)

## 🛠️ System Design

Refer to [design.md](design.md)

## 🚀 Getting Started

### 1️⃣ Set up ChatbotBuilder

#### **Frontend Setup**  
Refer to [app/README.md](app/README.md) for frontend setup steps.

#### **API Setup**  
Refer to [api/README.md](api/README.md) for API setup steps.

### 2️⃣ Run ChatbotBuilder

Once the frontend and API are set up, launch the platform and start creating your AI chatbot.

### 3️⃣ Create Your Chatbot

- Configure chatbot **guidelines** and **intent flow** to define how it interacts with users.
- Customize responses to specific customer queries for better user experience.

Refer to video recording https://www.youtube.com/watch?v=VCwTL6jz_XU

### 4️⃣ Share & Deploy

Once configured, share the chatbot’s link with users to start engaging conversations.

## 💡 Why ChatbotBuilder?

- **Open source**
- **Low-code & intuitive** – Easily create AI chatbots without deep technical knowledge.
- **Highly configurable** – Define chat behavior, restrict responses, and guide AI interactions.
- **Flexible integrations** – Works with OpenAI, DeepSeek AI, and can be expanded with custom APIs.

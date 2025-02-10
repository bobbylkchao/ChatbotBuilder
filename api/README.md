# API Setup

**Require: Node >= 16**

## 1️⃣ Install PostgreSQL  
Download and install PostgreSQL from [official website](https://www.postgresql.org/download/).  

## 2️⃣ Install Dependencies & Setup Environment  

```sh
cd ./api
npm i
cp ./.env.example .env
```

## 3️⃣ Configure Database Credentials

Edit the `.env` file to set your PostgreSQL username and password:

```
DB_USERNAME=
DB_PASSWORD=
```

## 4️⃣ Configure Google Sign-In

Obtain your Google Sign-In Client ID and Client Secret from [Google Developers Console](https://developers.google.com/identity/sign-in/web/sign-in), then update your .env file:

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## 5️⃣ Select AI Model

Set the AI model in .env by choosing either `OpenAI` or `DeepSeek`:

```
AI_MODEL=
```

### (Optional) OpenAI API Configuration

If AI_MODEL=OpenAI, configure OpenAI API settings:

```
OPENAI_API_KEY=
OPENAI_ORGANIZATION_ID=
OPENAI_PROJECT_ID=
OPENAI_MODEL=gpt-3.5-turbo
```

### (Optional) DeepSeek API Configuration

If AI_MODEL=DeepSeek, configure DeepSeek API settings:

```
DEEPSEEK_API_KEY=
DEEPSEEK_API_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat
```

## 6️⃣ (Optional) Configure AWS CloudWatch Logs

If using AWS CloudWatch for monitoring, update .env:

```
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_CLOUDWATCH_LOG_GROUP_NAME=
AWS_CLOUDWATCH_LOG_STREAM_NAME=
```

## 7️⃣ Set Up Database & Run Migrations

Initialize your local database and populate tables using Prisma:

```
npx prisma migrate dev
```

## 8️⃣ Start API Application

```
npm run dev
```

## 9️⃣ API Endpoints

- GraphQL API: http://localhost:4000/graphql
- Chat API: http://localhost:4000/chat

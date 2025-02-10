# Frontend Setup

## 1️⃣ Install Dependencies & Setup Environment  

```sh
cd app
npm i
cp ./.env.example .env
```

## 2️⃣ Configure Google Sign-In

Obtain your Google Sign-In Client ID from [Google Developers Console](https://developers.google.com/identity/sign-in/web/sign-in) and update the .env file:

```
REACT_APP_GOOGLE_AUTH_CLIENT_ID=''
```

## 3️⃣ (Optional) Configure Google Analytics

If you want to track app visits using Google Analytics, get your GA ID from Google Analytics and update the .env file:


```
REACT_APP_GOOGLE_GA_ID=''
```

## 4️⃣ Start Frontend Application

```
npm run start
```

## 5️⃣ Access the Frontend

Visit the app at: http://localhost:3000

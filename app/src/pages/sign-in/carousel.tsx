import React from 'react'
import { Carousel } from 'antd'
import { CarouselItemContainer } from './styled'

const SignInCarousel: React.FC = () => {
  return (
    <Carousel autoplay={true} autoplaySpeed={5000}>
      <CarouselItemContainer>
        <div style={{ padding: 20 }}>
          <p>ChatbotBuilder is an <b>Open Source</b>, web-based platform for creating AI-powered chatbots. Built with React.js, GraphQL, and <b>OpenAI</b> / <b>DeepSeek</b> AI models, it enables users to design and deploy intelligent chatbots for various conversational scenarios.</p>
        </div>
      </CarouselItemContainer>
      <CarouselItemContainer>
        <div style={{ padding: 20 }}>
          <p>By defining chat scope, guidelines, and intents, users can shape how the chatbot interacts, ensuring meaningful and context-aware conversations. Whether for <b>open-ended</b> or <b>tailored</b> responses, ChatbotBuilder enhances AI-driven communication with ease.</p>
        </div>
      </CarouselItemContainer>
    </Carousel>
  )
}

export default SignInCarousel

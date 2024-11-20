import React from 'react'
import { RobotOutlined } from '@ant-design/icons'
import { NotFoundContainer } from './styled'

const BotNotFound = () => {
  return (
    <NotFoundContainer>
      <RobotOutlined style={{fontSize: 40, marginBottom: 20}}/>
      <span>Oops! Bot not found...</span>
    </NotFoundContainer>
  )
}

export default BotNotFound

import React from 'react'
import { Link } from 'react-router-dom'
import { GithubOutlined } from '@ant-design/icons'
import { Wrapper } from './styled'

interface GitHubIconArgs {
  color?: string
  flex?: string | number
}

const GitHubIcon = ({ color, flex }: GitHubIconArgs): React.ReactElement => {
  return (
    <Wrapper color={color} flex={flex}>
      <Link to={process.env.REACT_APP_APP_REPO || ''} target="_blank" rel="noopener noreferrer" title='ChatbotBuilder Github Repo'>
        <GithubOutlined/>
      </Link>
    </Wrapper>
  )
}

export default GitHubIcon

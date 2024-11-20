import React from 'react'
import { Link } from 'react-router-dom'
import { GithubOutlined } from '@ant-design/icons'
import { Wrapper } from './styled'

const GitHubIcon = (): React.ReactElement => {
  return (
    <Wrapper>
      <Link to={process.env.REACT_APP_APP_REPO || ''} target="_blank" rel="noopener noreferrer">
        <GithubOutlined/>
      </Link>
    </Wrapper>
  )
}

export default GitHubIcon

import React from 'react'
import { Wrapper } from '../../components/wrapper/styled'

const NotFoundPage = (): React.ReactElement => {
  document.title = 'Page not found'
  return (
    <Wrapper>
      Page not found
    </Wrapper>
  )
}

export default NotFoundPage

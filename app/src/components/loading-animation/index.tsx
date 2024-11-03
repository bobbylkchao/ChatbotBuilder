import React from 'react'
import './index.css'

const LoadingAnimation = (): React.ReactElement => {
  return (
    <div className="loading-dots">
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </div>
  )
}

export default LoadingAnimation

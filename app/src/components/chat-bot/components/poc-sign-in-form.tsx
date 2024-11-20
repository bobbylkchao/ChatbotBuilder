import React, { useEffect } from 'react'

const PocSignInForm = (): React.ReactElement => {
  useEffect(() => {
    const chatContainerDom = document.getElementById('chatbot-container-bottom')
    if (chatContainerDom) {
      chatContainerDom.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return (
    <div style={{
      display: 'flex',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '10px',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}>
        <label style={{display: 'flex'}} htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          style={{display: 'flex', padding: '8px', marginTop: '5px' }}
          placeholder="Enter username"
        />
        <label style={{display: 'flex', marginTop: '10px'}} htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          style={{display: 'flex', padding: '8px', marginTop: '5px' }}
          placeholder="Enter password"
        />
        <button type="button" style={{ display: 'flex', width: '100%', marginTop: '10px', padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', justifyContent: 'center'}}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default PocSignInForm

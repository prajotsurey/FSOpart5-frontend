import React from 'react'

const LoginForm = ({ handleLogin, username, setUsername, password, setPassword }) => (
  <form onSubmit={handleLogin}>
    <div>
      <h2>
        log in to application
      </h2>
    </div>
    <div>
      username
      <input
        id='username'
        type='text'
        value={username}
        name='username'
        onChange={({ target }) => {setUsername(target.value)}}
      />
    </div>
    <div>
      password
      <input
        id='password'
        type='password'
        value={password}
        name='password'
        onChange={({ target }) => {setPassword(target.value)}}
      />
    </div>
    <button id='login-button'type='submit'>login</button>
  </form>
)

export default LoginForm
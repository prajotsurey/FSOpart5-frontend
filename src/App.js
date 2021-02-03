import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import ErrorMessage from './components/ErrorMessage'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  console.log({user})
  
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      console.log({user})
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      setUser(user)
      setUsername('')
      setPassword('')
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogAppUser')
  }

  return (
    <div>
      <ErrorMessage message={errorMessage}/>
      {
        user === null 
        ? <LoginForm 
        handleLogin={handleLogin} 
        username={username} 
        setUsername={setUsername} 
        password={password} 
        setPassword={setPassword}
        />
        : <div>
          <h2>blogs</h2>
          <p>{user.name} logged in</p> <button onClick={handleLogout}>logout</button>

          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
      }
    </div>
  )
}

export default App
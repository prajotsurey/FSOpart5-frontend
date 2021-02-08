import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import ErrorMessage from './components/ErrorMessage'
import Notification from './components/Notification'
import './index.css'
import BlogForm from './components/BlogForm'
import Toggleable from './components/Toggleable'
import Axios from 'axios'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const blogFormRef = useRef()

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
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      setErrorMessage(error.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogAppUser')
    setNotificationMessage('You have logged out')
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000);
  }

  const addBlog = async (newBlog) => {
    try {
      const returnedBlog = await  blogService.create(newBlog)
      blogFormRef.current.toggleVisibility()
      setBlogs(blogs.concat(returnedBlog))
      setNotificationMessage(`A new blog ${returnedBlog.title} by ${returnedBlog.author} added.`)
    } catch (error) {
      setErrorMessage(error.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const updateBlog = async (id, updatedBlog, user) => {
    try {
      const returnedBlog = await blogService.update(id, updatedBlog)
      const newBlogs = blogs.filter(blog => blog.id !== returnedBlog.id)
      returnedBlog.user = user
      setBlogs(newBlogs.concat(returnedBlog).sort((a,b) => b.likes - a.likes ))
      setNotificationMessage(`Blog updated`)

    } catch (error) {
      setErrorMessage(error.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  return (
    <div>
      <Notification message={notificationMessage}/>
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
          <Toggleable buttonLabel = 'new blog' ref={blogFormRef}>
            <BlogForm createBlog = {addBlog} />
          </Toggleable>
          <h2>blogs</h2>
          <p>{user.name} logged in</p> <button onClick={handleLogout}>logout</button>

          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} updateBlog={updateBlog}/>
          )}
        </div>
      }
    </div>
  )
}

export default App
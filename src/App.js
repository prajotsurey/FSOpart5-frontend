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

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogURL, setBlogURL] = useState('')
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

  const addBlog = async (event) => {
    event.preventDefault()
    const newBlog = {
      title: blogTitle,
      author: blogAuthor,
      url: blogURL,
    }

    try {
      const returnedBlog = await  blogService.create(newBlog)
      blogFormRef.current.toggleVisibility()
      setBlogTitle('')
      setBlogAuthor('')
      setBlogURL('')
      setBlogs(blogs.concat(returnedBlog))
      setNotificationMessage(`A new blog ${returnedBlog.title} by ${returnedBlog.author} added.`)
    } catch (error) {
      console.log(error)
      setErrorMessage(error.response)
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
            <BlogForm
              blogTitle = {blogTitle}
              setBlogTitle = {setBlogTitle}
              blogAuthor = {blogAuthor}
              setBlogAuthor = {setBlogAuthor}
              blogURL = {blogURL}
              setBlogURL = {setBlogURL}
              addBlog = {addBlog}
            />
          </Toggleable>
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
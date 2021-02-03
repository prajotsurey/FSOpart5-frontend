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
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogURL, setBlogURL] = useState('')

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

  const addBlog = async (event) => {
    event.preventDefault()
    const newBlog = {
      title: blogTitle,
      author: blogAuthor,
      url: blogURL,
    }

    try {
      const returnedBlog = await  blogService.create(newBlog)
      setBlogTitle('')
      setBlogAuthor('')
      setBlogURL('')
      
      setBlogs(blogs.concat(returnedBlog))

    } catch (error) {
      setErrorMessage(error.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
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
          <h2>create new</h2>
          <form onSubmit={addBlog}>
            <p>
            title:
            <input
              type='text'
              name='blogtitle'
              value={blogTitle}
              onChange={({target})=> {setBlogTitle(target.value)}}
            />
            </p>
            <p>
            author:
            <input
              type='text'
              name='blogauthor'
              value={blogAuthor}
              onChange={({target})=> {setBlogAuthor(target.value)}}
            />
            </p>
            <p>
            url:
            <input
              type='text'
              name='blogurl'
              value={blogURL}
              onChange={({target})=> {setBlogURL(target.value)}}
            />
            </p>         
            <button type='submit'>Create</button>
          </form>
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
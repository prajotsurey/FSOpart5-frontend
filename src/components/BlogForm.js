import React, { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogURL, setBlogURL] = useState('')

  const addBlog = (event) => {
    event.preventDefault()

    createBlog({
      title: blogTitle,
      author: blogAuthor,
      url: blogURL
    })

    setBlogTitle('')
    setBlogAuthor('')
    setBlogURL('')


  }

  return(
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <p>
            title:
          <input
            type='text'
            name='blogtitle'
            value={blogTitle}
            onChange={({ target }) => {setBlogTitle(target.value)}}
          />
        </p>
        <p>
            author:
          <input
            type='text'
            name='blogauthor'
            value={blogAuthor}
            onChange={({ target }) => {setBlogAuthor(target.value)}}
          />
        </p>
        <p>
            url:
          <input
            type='text'
            name='blogurl'
            value={blogURL}
            onChange={({ target }) => {setBlogURL(target.value)}}
          />
        </p>
        <button type='submit'>Create</button>
      </form>
    </div>
  )
}

export default BlogForm
import React, {useState} from 'react'

const Blog = ({ blog, updateBlog }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = { 
    padding:5,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const clickHandler = () => {
    // console.log(blog)
    const updatedBlog = {
      title:blog.title,
      url:blog.url,
      author:blog.author,
      user:blog.user.id,
      likes: blog.likes + 1
    } 
    // console.log(updatedBlog)
    updateBlog(blog.id, updatedBlog, blog.user)
  }

  return(
    <div style={blogStyle}>
      {blog.title} {blog.author} 
      { 
        showDetails 
        ? <button onClick={() => {setShowDetails(false)}}>hide</button> 
        : <button onClick={() => {setShowDetails(true)}}>view</button>
      }
      {
        showDetails
        ?
        <div>
          <div>{blog.url}</div>
          <div> 
            {blog.likes} likes <button onClick={clickHandler}>like</button>
          </div>
          <div>{blog.user.username}</div> 
        </div>
        :
        null
      }
    </div>
  )
}

export default Blog

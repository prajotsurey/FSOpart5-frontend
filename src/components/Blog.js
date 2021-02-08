import React, {useState} from 'react'
import blogs from '../services/blogs'

const Blog = ({ blog }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = { 
    padding:5,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
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
            0 likes <button>like</button>
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

import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Blog from './Blog'

test('renders blog', () => {
  const blog = {
    title: 'Title of blog',
    author: 'Author of blog',
    url: 'url',
    likes: 'likes',
    user: {
      username: 'username',
      id: 'id',
      name: 'name'
    }
  }

  const component = render(
    <Blog blog={blog} />
  )

  expect(component.container).toHaveTextContent(
    'Title of blog'
  )
  expect(component.container).toHaveTextContent(
    'Author of blog'
  )
  expect(component.container).not.toHaveTextContent(
    'url'
  )
  expect(component.container).not.toHaveTextContent(
    'likes'
  )
})
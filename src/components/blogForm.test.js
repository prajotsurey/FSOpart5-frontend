import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

test('', () => {
  const addBlog = jest.fn()
  const component = render(
    <BlogForm createBlog = {addBlog} />
  )

  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')
  const form = component.container.querySelector('form')
  const blog = {
    title: 'title of blog',
    author: 'author of blog',
    url: 'url of blog'
  }

  fireEvent.change(title, {
    target: { value: blog.title }
  })
  fireEvent.change(author, {
    target: { value: blog.author }
  })
  fireEvent.change(url, {
    target: { value: blog.url }
  })
  fireEvent.submit(form)
  expect(addBlog.mock.calls).toHaveLength(1)
  expect(addBlog.mock.calls[0][0]).toMatchObject(blog)
})
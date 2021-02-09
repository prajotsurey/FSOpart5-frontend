import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'


describe('<Togglable />', () => {
  let component
  const user = {
    username: 'username',
    id: 'id',
    name: 'name'
  }
  const updateBlog = jest.fn()

  const blog = {
    title: 'Title of blog',
    author: 'Author of blog',
    url: 'url of blog',
    likes: 79,
    user: user
  }

  beforeEach(() => {
    component = render(
      <Blog blog={blog} user={user} updateBlog={updateBlog}/>
    )
  })

  test('renders blog', () => {


    expect(component.container).toHaveTextContent(
      'Title of blog'
    )
    expect(component.container).toHaveTextContent(
      'Author of blog'
    )
    expect(component.container).not.toHaveTextContent(
      'url of blog'
    )
    expect(component.container).not.toHaveTextContent(
      79
    )
  })

  test('shows url and likes when show button is pressed', () => {
    const button = component.getByText('view')
    fireEvent.click(button)

    expect(component.container).toHaveTextContent(
      'url'
    )
    expect(component.container).toHaveTextContent(
      '79 likes'
    )
  })

  test('updateBlog is called twice when like button is clickec twice', () => {
    const button = component.getByText('view')
    fireEvent.click(button)
    const likeButton = component.container.querySelector('.likeButton')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)
    expect(updateBlog.mock.calls).toHaveLength(2)
  })

})
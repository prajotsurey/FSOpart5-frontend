describe('Blog app', function () {

  beforeEach(function(){
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user1 = {
      name:'name',
      username:'username',
      password:'password'
    }
    const user2 = {
      name:'name2',
      username:'username2',
      password:'password2'
    }
    cy.request('POST', 'http://localhost:3001/api/users', user1)
    cy.request('POST', 'http://localhost:3001/api/users', user2)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.get('button').contains('login')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('username')
      cy.get('#password').type('password')
      cy.get('#login-button').click()

      cy.contains('name logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('username21')
      cy.get('#password').type('password21')
      cy.get('#login-button').click()

      cy.get('html').should('not.contain','name logged in')
      cy.get('.error')
        .should('contain', 'invalid username or password')
        .should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'username', password: 'password' })
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('blog1 title')
      cy.get('#author').type('blog1 author')
      cy.get('#url').type('blog1 url')

      cy.get('#create-blog').click()

      cy.get('html').should('contain','blog1 title')
    })

    describe('and blog exists', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'blog title', author: 'blog author', url: 'blog url' })
      })

      it('blog can be liked', function () {
        cy.contains('view').click()
        cy.get('html').should('contain','0 likes')
        cy.contains('like').click()
        cy.get('html')
          .should('contain','1 likes')
          .and('contain', 'Blog updated')
      })

      it('blog can be deleted by user', function () {
        cy.contains('view').click()
        cy.contains('remove').click()
        cy.get('html')
          .should('not.contain','blog title')
          .and('not.contain', 'blog author')
      })

      it('other users cannot delete blog', function () {
        cy.contains('logout').click()
        cy.login({ username: 'username2', password: 'password2' })
        cy.contains('view').click()
        cy.get('html')
          .should('not.contain','remove')
      })

    })
    describe('and multiple liked blogs exist', function() {
      beforeEach(function() {
        cy.createAndLikeBlog({ title: 'blog title', author: 'blog author', url: 'blog url', likes: 7 })
        cy.createAndLikeBlog({ title: 'blog title2', author: 'blog author2', url: 'blog url2', likes: 5 })
        cy.createAndLikeBlog({ title: 'blog title3', author: 'blog author3', url: 'blog url3', likes: 62 })
      })

      it('blogs are arranged in decreasing order of likes', function() {
        let arrayOfLikes =[]
        cy.get('.blog')
          .then((blogs) => {
            blogs.map((index,blog) => {
              cy.wrap(blog)
                .find('button')
                .click()
                .parent()
                .find('.likes').invoke('text').then((text) => { arrayOfLikes.push(parseInt(text.split(' ')[0]))})
            })
          }).then(() => {
            console.log(arrayOfLikes)
            arrayOfLikes.reduce( ( pv, cv ) => {
              expect(pv > cv).to.be.true
              return cv
            })
          })
      })
    })
  })

})
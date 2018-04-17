const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
const app = require('../app')

const mongoose = require("mongoose")
const Blog = require('../models/blog.model')
const User = require('../models/user.model')
chai.use(chaiHttp)
let token = ""
//User test
describe('User', () => {
  before((done) => {
    User.remove({}, err => {
        done()
    })
  })

  describe('/post signup', () => {
    it('it should not create a user, email format is wrong', (done) => {
      let userData = {
        name: 'Dani Damara',
        email: 'danny12march@gmailcom',
        password: '12nightmare'
      }
      chai.request(app)
      .post('/signup')
      .send(userData)
      .end((err, res) => {
          expect(res).to.have.status(406)
          expect(res.body).to.ownProperty('message').to.equal('Email Format is wrong')
        done()
      })
    })

    it('it should not create a user, password min 5', (done) => {
      let userData = {
        name: 'Dani Damara',
        email: 'danny12march@gmail.com',
        password: '12ni'
      }
      chai.request(app)
      .post('/signup')
      .send(userData)
      .end((err, res) => {
          expect(res).to.have.status(406)
          expect(res.body).to.ownProperty('message').to.equal('password minimal 5')
        done()
      })
    })

    it('it should not create a user, password must contained number', (done) => {
      let userData = {
        name: 'Dani Damara',
        email: 'danny12march@gmail.com',
        password: 'nightmare'
      }
      chai.request(app)
      .post('/signup')
      .send(userData)
      .end((err, res) => {
          expect(res).to.have.status(406)
          expect(res.body).to.ownProperty('message').to.equal('Password must contained number')
        done()
      })
    })

    it('it should create a user', (done) => {
      let userData = {
        name: 'Dani Damara',
        email: 'damara@gmail.com',
        password: 'damara12'
      }
      chai.request(app)
      .post('/signup')
      .send(userData)
      .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(201)
          expect(res.body).to.ownProperty('message').to.equal('User has Succesfully added')
          expect(res.body).to.ownProperty('user').to.be.a('object')
          expect(res.body.user).to.ownProperty('_id')
          expect(res.body.user).to.ownProperty('name')
          expect(res.body.user).to.ownProperty('email')
          expect(res.body.user).to.ownProperty('password')
        done()
      })
    })

    it('it should not create a user, email already in db', (done) => {
      let userData = {
        name: 'Dani Damara',
        email: 'damara@gmail.com',
        password: 'damara12'
      }
      chai.request(app)
      .post('/signup')
      .send(userData)
      .end((err, res) => {
          expect(res).to.have.status(406)
          expect(res.body).to.ownProperty('message').to.equal('email is not available')
        done()
      })
    })
  })

  describe('/post signin', () => {
    it('it should not sign in, email is empty', (done) => {
      let userData = {
        email: '',
        password: 'adapasswordaj'
      }
      chai.request(app)
      .post('/signin')
      .send(userData)
      .end((err, res) => {
          expect(res).to.have.status(400)
          expect(res.body).to.ownProperty('message').to.equal('email / Password must be filled')
        done()
      })
    })

    it('it should not sign in, password is empty', (done) => {
      let userData = {
        email: 'danny12march@gmail.com',
        password: ''
      }
      chai.request(app)
      .post('/signin')
      .send(userData)
      .end((err, res) => {
          expect(res).to.have.status(400)
          expect(res.body).to.ownProperty('message').to.equal('email / Password must be filled')
        done()
      })
    })

    it('it should not sign in, email is not registered', (done) => {
      let userData = {
        email: 'dummy12@gmail.com',
        password: 'dummy12'
      }
      chai.request(app)
      .post('/signin')
      .send(userData)
      .end((err, res) => {
          expect(res).to.have.status(406)
          expect(res.body).to.ownProperty('message').to.equal('Email / Password is Wrong')
        done()
      })
    })

    it('it should not sign in, password is wrong', (done) => {
      let userData = {
        email: 'damara@gmail.com',
        password: 'damara13'
      }
      chai.request(app)
      .post('/signin')
      .send(userData)
      .end((err, res) => {
          expect(res).to.have.status(406)
          expect(res.body).to.ownProperty('message').to.equal('Password is Wrong')
        done()
      })
    })

    it('it should sign in', (done) => {
      let userData = {
        email: 'damara@gmail.com',
        password: 'damara12'
      }
      chai.request(app)
      .post('/signin')
      .send(userData)
      .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body).to.be.a('object')
          expect(res.body).to.ownProperty('message').to.equal('User Login Succesfully')
          expect(res.body).to.ownProperty('user').to.be.a('object')
          expect(res.body).to.ownProperty('token').to.be.a('string')
          token = res.body.token
        done()
      })
    })
  })

})


//blog test
describe('Blogs', () =>{
    let blogId = ""
    let temptoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhY2EwYjQyZmI1Y2QyNjI1MzVkM2QxYiIsImVtYWlsIjoiZGFtYXJhZGFuaUBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1MjM0NjE4MDN9.GA3N_TwpgOSYxNqD1-6B-nuP2Sv7t9eecRPfN5JwrwE'
    before((done) => {
      Blog.remove({}, (err) => {
        done()
      })
    })

    describe('/post create Blog', () => {

      it('it should not create a Blog, input null', (done) => {
        chai.request(app)
        .post('/blog/create')
        .send()
        .set('token', token)
        .end((err, res) => {
            expect(res).to.have.status(406)
            expect(res.body).to.ownProperty('message').to.equal('U need to fill Title / Content')
          done()
        })
      })

      it('it should not create a Blog, no token, need to Login', (done) => {
        let blogData = {
          title: 'First Title',
          content: 'Blog Content lorem ipsum dirkodir'
        }
        chai.request(app)
        .post('/blog/create')
        .send(blogData)
        .end((err, res) => {
            expect(res).to.have.status(403)
            expect(res.body).to.ownProperty('message').to.equal('U need to Login')
          done()
        })
      })

      it('it should not create a Blog, token is invalid', (done) => {
        let blogData = {
          title: 'First Title',
          content: 'Blog Content lorem ipsum dirkodir'
        }
        chai.request(app)
        .post('/blog/create')
        .send(blogData)
        .set('token', temptoken)
        .end((err, res) => {
            expect(res).to.have.status(500)
            expect(res.body).to.ownProperty('message').to.equal('token is invalid')
          done()
        })
      })

      it('it should create a Blog', (done) => {
        let blogData = {
          title: 'First Title',
          content: 'Blog Content lorem ipsum dirkodir'
        }
        chai.request(app)
        .post('/blog/create')
        .send(blogData)
        .set('token', token)
        .end((err, res) => {
            expect(err).to.be.null
            expect(res).to.have.status(200)
            expect(res.body).to.ownProperty('message').to.equal('New Blog has been added')
            expect(res.body).to.ownProperty('data').to.be.a('object')
            expect(res.body.data).to.ownProperty('_id')
            expect(res.body.data).to.ownProperty('title')
            expect(res.body.data).to.ownProperty('content')
            expect(res.body.data).to.ownProperty('user')
            blogId = res.body.data._id
          done()
        })
      })

    })

    describe('/get All Blog', () => {

      it('it should not show Blog, u need to login', (done) => {
        chai.request(app)
        .get('/blog')
        .end((err, res) => {
            expect(res).to.have.status(403)
            expect(res.body).to.ownProperty('message').to.equal('U need to Login')
          done()
        })
      })

      it('it should not show Blog, token is invalid', (done) => {
        chai.request(app)
        .get('/blog')
        .set('token', temptoken)
        .end((err, res) => {
            expect(res).to.have.status(500)
            expect(res.body).to.ownProperty('message').to.equal('token is invalid')
          done()
        })
      })

      it('it should show Blog by User Id', (done) => {
        chai.request(app)
        .get('/blog')
        .set('token', token)
        .end((err, res) => {
            expect(res).to.have.status(200)
            expect(res.body).to.ownProperty('message').to.equal('Show All Blog by User Id')
            expect(res.body).to.ownProperty('data').to.be.a('array')
          done()
        })
      })
    })

    describe('/put Blog', () => {

      it('it should not update Blog, u need to login', (done) => {
        chai.request(app)
        .put(`/blog/edit/${blogId}`)
        .end((err, res) => {
            expect(res).to.have.status(403)
            expect(res.body).to.ownProperty('message').to.equal('U need to Login')
          done()
        })
      })

      it('it should not update Blog, token is invalid', (done) => {
        chai.request(app)
        .put(`/blog/edit/${blogId}`)
        .set('token', temptoken)
        .end((err, res) => {
            expect(res).to.have.status(500)
            expect(res.body).to.ownProperty('message').to.equal('token is invalid')
          done()
        })
      })

      it('it should Edit Blog', (done) => {
        let editBlog = {
          title: 'After Edit',
          content: 'content after edit'
        }
        chai.request(app)
        .put(`/blog/edit/${blogId}`)
        .send(editBlog)
        .set('token', token)
        .end((err, res) => {
            expect(res).to.have.status(200)
            expect(res.body).to.ownProperty('message').to.equal('Edit Blog Success')
            expect(res.body).to.ownProperty('result').to.be.a('object')
            expect(res.body.result.ok).to.equal(1)
          done()
        })
      })

    })

    describe('/delete Blog', () => {
      it('should not delete blog, no token, need to login', (done) => {
        chai.request(app)
        .delete(`/blog/delete/${blogId}`)
        .end((err, res) => {
            expect(res).to.have.status(403)
            expect(res.body).to.ownProperty('message').to.equal('U need to Login')
          done()
        })
      })

      it('should not delete blog, Blog id is invalid', (done) => {
        chai.request(app)
        .delete(`/blog/delete/1231d2311gwefsddf`)
        .set('token', token)
        .end((err, res) => {
            expect(res).to.have.status(500)
            expect(res.body).to.ownProperty('message').to.equal('error')
            expect(res.body).to.ownProperty('err').to.be.a('object')
            expect(res.body.err).to.ownProperty('message')
          done()
        })
      })

      it('should not delete blog, Blog id is undefined', (done) => {
        chai.request(app)
        .delete(`/blog/delete/${blogId}`)
        .set('token', token)
        .end((err, res) => {
            expect(res).to.have.status(200)
            expect(res.body).to.ownProperty('message').to.equal('Delete Blog Success')
            expect(res.body).to.ownProperty('result').to.be.a('object')
            expect(res.body.result.ok).to.equal(1)
          done()
        })
      })

    })

})

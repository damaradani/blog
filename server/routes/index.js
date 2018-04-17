const route = require('express').Router()
const {signIn, signUp, profile} = require('../controllers/user.controller');
const {adminOnly} = require('../middleware/auth')

route.get('/', function(req, res){
        res.status(200).json({
          message: 'Halaman Index'
        })
      })
      .get('/profile', profile)
      .post('/signin', signIn)
      .post('/signup', signUp)

module.exports = route

const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const pwdtoken = process.env.pwdtoken

module.exports = {
  loginAuth: function(req, res, next){
    console.log('Apa Masuk auth?')
    
    if(req.headers.token){
      let token = req.headers.token
      jwt.verify(token, pwdtoken, function(err, decoded) {
        // console.log('Error : ',err)
        // console.log('Decoded :', decoded)
        if(err){
          res.status(500).json({
            message: 'token is invalid'
          })
        }else{
          //cek id dan email di db user ada belum
          cekEmail(req, res, next, decoded)
          // next()
        }
      });
    }else{
      res.status(403).json({
        message: 'U need to Login'
      })
    }
  },
  adminOnly: function(req, res, next){
    let token = req.headers.token
    let decoded = jwt.verify(token, pwdtoken)
    // console.log(decoded.id);

    if(token){
      User.findOne({_id:decoded.id})
           .then(users => {
             // console.log(users);
             if(!users){
                res.status(403).json({
                  message: "U need to Login"
                })
             }else{
                if(users.role === "admin"){
                  next()
                }else{
                  res.status(401).json({
                    message: "Only Admin can acces this Page"
                  })
                }

             }
           })
           .catch(err =>{
              res.status(500).json({
                message: err
              })
           })
    }else{
      res.status(403).json({
        message: "U need to Login"
      })
    }
  },
  tokenCheck: function (req, res) {
    if(req.headers.token){
      let token = req.headers.token
      jwt.verify(token, pwdtoken, function(err, decoded) {
        if(err){
          res.status(500).json({
            message: 'token is invalid'
          })
        }else{
          User.findOne({_id:decoded.id, email:decoded.email})
            .then(users =>{
              if(!users){
                res.status(401).json({
                 message: "Token invalid",
                  states: false
                }) 
              }else{
                res.status(200).json({
                  message: "Token is valid",
                  states: true,
                  user: users
                }) 
              }
            })
            .catch(err => {
              res.status(500).json({
                message: err
              })
            })
              }
      });
    }else{
      res.status(403).json({
        message: 'U need to Login'
      })
    }
  }
}


function cekEmail(req, res, next, decoded){
  User.findOne({_id:decoded.id, email:decoded.email})
       .then(users =>{
         if(!users){
           // console.log('user dan email ga ada di data user');
           res.status(401).json({
             message: "Anda harus Login"
           })
         }else{
           req.users = users
           next()
         }
       })
       .catch(err => {
         res.status(500).json({
           message: err
         })
       })
}

const jwt = require('jsonwebtoken')
const Blog = require('../models/blog.model')
const pwdtoken = process.env.pwdtoken

module.exports = {
  showAllBlog: function(req, res){
    Blog.find()
        .populate('user')
        .exec()
        .then(blog =>{
          res.status(200).json({
            message: "Show All Blog",
            data: blog
          })
        })
        .catch(err => {
          res.status(500).json({
            message: "error",
            err
          })
        })
  },
  showBlogById: function(req, res){
    let blog_id = req.params.id

    Blog.findOne({_id:blog_id})
        .populate('user')
        .exec()
        .then(blog =>{
          res.status(200).json({
            message: "Show Blog By Id",
            data: blog
          })
        })
        .catch(err => {
          res.status(500).json({
            message: "error",
            err
          })
        })
  },
  getBlogByUserId: function(req, res){
    let token = req.headers.token
    let decoded = jwt.verify(token, pwdtoken)
    let user_id = decoded.id

    Blog.find({user:user_id})
        .then(blog => {
          res.status(200).json({
            message: "Show All Blog by User Id",
            data: blog
          })
        })
        .catch(err => {
          res.status(500).json({
            message: "error",
            err
          })
        })
  },
  createBlog: function(req, res){
    let token = req.headers.token
    let decoded = jwt.verify(token, pwdtoken)

    if(req.body.title && req.body.content){
      let newblog = new Blog ({
        title: req.body.title,
        content: req.body.content,
        user: decoded.id
      })

      newblog.save((err, result) => {
        if(err){
          res.status(500).json({
            message: "error",
            err
          })
        }else{
          res.status(200).json({
            message: "New Blog has been added",
            data: result
          })
        }
      })
    }else{
      res.status(406).json({
        message: "U need to fill Title / Content"
      })
    }


  },
  editBlog: function(req, res){
    let blog_id = req.params.blog_id
    let title = req.body.title
    let content = req.body.content

    Blog.update( { _id:blog_id } , { $set:{ title, content } } )
        .then(result => {
          res.status(200).json({
            message: "Edit Blog Success",
            result
          })
        })
        .catch(err => {
          res.status(500).json({
            message: "error",
            err
          })
        })

  },
  deleteBlog: function(req, res){
    console.log('Masuk Sini')
    
    if(req.params.blog_id){
      let blog_id = req.params.blog_id

      Blog.remove({_id:blog_id})
          .then(result => {
            res.status(200).json({
              message: "Delete Blog Success",
              result
            })
          })
          .catch(err => {
            res.status(500).json({
              message: "error",
              err
            })
          })
    }else{
      res.status(406).json({
        message: "Blog Id is undefined"
      })
    }


  }
}












//

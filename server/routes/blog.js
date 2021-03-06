const route = require('express').Router()
const {createBlog, editBlog, showAllBlog, showBlogById, getBlogByUserId, deleteBlog} = require('../controllers/blog.controller');
const {loginAuth} = require('../middleware/auth')

route.get('/', loginAuth, getBlogByUserId)
     .get('/all', showAllBlog) 
     .get('/:id', showBlogById)
     .post('/create', loginAuth, createBlog)
     .put('/edit/:blog_id', loginAuth, editBlog)
     .delete('/delete/:blog_id', loginAuth, deleteBlog)

module.exports = route

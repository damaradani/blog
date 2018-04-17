const mongoose = require('mongoose')
const Schema = mongoose.Schema

let blogSchema = new Schema({
  title: String,
  content: String,
  user: {type:Schema.Types.ObjectId, ref:'User'}
},{
  timestamps: true
})

let Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog

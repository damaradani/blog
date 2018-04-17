const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
require('dotenv').config()

//mongodb local
mongoose.connect('mongodb://localhost/blog_db')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))
// app.use(morgan('dev'))

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function(){
  console.log(('Connected to mongoose'))
})

const index = require('./routes/index')
app.use('/', index)

const blogIndex = require('./routes/blog')
app.use('/blog', blogIndex)

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Server Started on ${port}`)
})

module.exports = app

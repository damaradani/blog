const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
require('dotenv').config()
let dbname = process.env.dbname
let dbpwd = process.env.dbpwd

// mongodb local for testing mocha chai
// mongoose.connect('mongodb://localhost/blog_db')

// mlab 
mongoose.connect(`mongodb://${dbname}:${dbpwd}@ds147872.mlab.com:47872/blog_db`)


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

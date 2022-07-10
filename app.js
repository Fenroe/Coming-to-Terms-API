require('dotenv').config()

const express = require('express')

const app = express()
const path = require('path')
const cors = require('cors')
const compression = require('compression')
const helmet = require('helmet')

const commentsRouter = require('./routes/comments')
const postsRouter = require('./routes/posts')
const usersRouter = require('./routes/users')

const mongoose = require('mongoose')
const mongoDB = process.env.MONGO_URI
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error.'))

app.use(helmet())
app.use(cors({
  origin: 'https://comingtoterms.netlify.app'
}))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(compression())
app.use('/comments', commentsRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)

app.listen(process.env.PORT, () => { 
  console.log('Listening on port ' + process.env.PORT)
})

require('dotenv').config()

const express = require('express')

const app = express()
const path = require('path')
const cors = require('cors')

const commentsRouter = require('./routes/comments')
const postsRouter = require('./routes/posts')
const usersRouter = require('./routes/users')

const mongoose = require('mongoose')
const mongoDB = process.env.MONGO_URI
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error.'))

const multer = require('multer')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(err, 'profile_pictures')
  },
  filename: (req, file, cb) => {
    cb(err, Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({ storage: storage })

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/comments', commentsRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)

app.listen(process.env.PORT, () => { 
  console.log('Listening on port ' + process.env.PORT)
})

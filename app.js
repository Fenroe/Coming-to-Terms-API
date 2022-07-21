require('dotenv').config()

const express = require('express')

const app = express()
const cors = require('cors')
const compression = require('compression')
const helmet = require('helmet')
const passport = require('./config/passport')

const apiRouter = require('./routes')

const mongoose = require('mongoose')
const mongoDB = process.env.MONGO_URI
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error.'))

app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN
}))
app.use(passport.initialize())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(compression())
app.use('/api', apiRouter)

app.listen(process.env.PORT, () => { 
  console.log('Listening on port ' + process.env.PORT)
})

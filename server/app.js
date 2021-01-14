const express = require('express')
const app = express()
const mongoose = require('mongoose')
const morgan = require('morgan')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
dotenv.config()

// db
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB Connected'))

mongoose.connection.on('error', (err) => {
  console.log(`DB connection error: ${err.message}`)
})

const postRoutes = require('./routes/post')
const authRoutes = require('./routes/auth')

// middleware
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())

app.use('/', postRoutes)
app.use('/auth', authRoutes)

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Unauthorized')
  }
})

const port = process.env.PORT
app.listen(port, () => {
  console.log(`listening on porn: ${port}`)
})

const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv').config()
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

const PORT = process.env.PORT || 4000

// const User = require('./models/user')
// const Quiz = require('./models/quiz')

const User = require('./routes/user')
const Quiz = require('./routes/quiz')

app.use('/user', User)
app.use('/quiz', Quiz)

app.get('/', (req, res) => {
    res.send('Hello Server')
})

app.listen(PORT, () => {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log(`Server running on http://localhost:${PORT}`))
        .catch((error) => console.log(error))
})
const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv').config()

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const PORT = process.env.PORT || 4000

app.get('/', (req, res) => {
    res.send('Hello Server')
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
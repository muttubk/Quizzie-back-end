const mongoose = require('mongoose')

const userShcema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    }
})

const User = mongoose.model('User', userShcema)

module.exports = User;
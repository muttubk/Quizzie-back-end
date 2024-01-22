const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

const User = require('../models/user')


const errorHandler = (res, error) => {
    console.log(error)
    res.status(500).json({
        status: 'Failed',
        error: "Internal server error."
    })
}

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({
                status: 'Failed',
                error: "All fields are required."
            })
        }
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            res.status(409).json({
                status: 'Failed',
                error: "User already exists."
            })
        }
        const encryptedPassword = await bcrypt.hash(password, 10)
        const userCreated = await User.create({ name, email, password: encryptedPassword })
        res.status(200).json({
            status: 'Success',
            message: "User created successfully."
        })
    } catch (error) {
        errorHandler(res, error)
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            return res.status(401).json({
                status: 'Failed',
                error: "User does not exist."
            })
        }
        const passwordMatched = await bcrypt.compare(password, existingUser.password)
        if (!passwordMatched) {
            return res.status(401).json({
                status: "Failed",
                error: "Invalid credentials."
            })
        }
        const jwtoken = jwt.sign(existingUser.toJSON(), process.env.JWT_SECRET)
        res.status(200).json({
            status: "Success",
            message: "You've logged in successfully.",
            jwtoken
        })
    } catch (error) {
        errorHandler(res, error)
    }
})

module.exports = router
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()

const isLoggedIn = (req, res, next) => {
    try {
        const { authorization } = req.headers
        const loggedInUser = jwt.verify(authorization, process.env.JWT_SECRET)
        req.user = loggedInUser.email
        next()
    } catch (error) {
        res.status(401).json({
            status: "Failed",
            error: "You're not logged in"
        })
    }
}

module.exports = isLoggedIn
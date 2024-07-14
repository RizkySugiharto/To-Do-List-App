const crypto = require('crypto')
const User = require('../../../models/User.model')
const { BadRequest, Unauthorized } = require('http-errors')
const utils = require('../../../utils')

module.exports = function (fastify, opts, done) {
    fastify.post('/register', async (req, reply) => {
        const hmac = crypto.createHmac('sha256', req.body.password)
        req.body.password = hmac.digest('hex')

        const user = new User(req.body)
    
        try {
            const isUserExists = await User.exists({ email: req.body.email })
            if (isUserExists){
                throw Unauthorized("User's email already exists")
            }

            const savedUser = await user.save()
            if (!savedUser) {
                throw BadRequest("Failed to save the user")
            }

            return reply.code(201).send({
                _id: savedUser._id,
                username: savedUser.username
            })
        } catch (error) {
            return utils.returnGeneralError(error, reply)
        }
    })
    
    fastify.post('/login', async (req, reply) => {
        if (!(req.body.email || req.body.password)) {
            return reply.code(403).send("Input is invalid")
        }
        
        const hmac = crypto.createHmac('sha256', req.body.password)
        req.body.password = hmac.digest('hex')
        
        try {
            const unauthorizedErrorMsg = "Email or password is invalid"
            const foundUser = await User.findOne({ email: req.body.email })
            if (!foundUser) {
                throw Unauthorized(unauthorizedErrorMsg)
            }

            const isPasswordValid = crypto.timingSafeEqual(
                Buffer.from(req.body.password),
                Buffer.from(foundUser ? foundUser.password : "")
            )
            if (!isPasswordValid) {
                throw Unauthorized(unauthorizedErrorMsg)
            }

            return reply.code(200).send({
                _id: foundUser._id,
                username: foundUser.username
            })
        } catch (error) {
            return utils.returnGeneralError(error, reply)
        }
    })

    done()
}
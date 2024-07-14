const fp = require('fastify-plugin')
const { Forbidden } = require('http-errors')

module.exports = fp(function(fastify, opts, done) {
    fastify.addHook('preValidation', async (req, reply) => {
        try {
            const apiKey = req.headers['x-api-key']
    
            if (apiKey !== process.env.API_KEY) {
                throw Forbidden("API call is forbidden")
            }
        } catch (error) {
            reply.code(error.statusCode || 500).send(error)
        }
    })

    done()
})
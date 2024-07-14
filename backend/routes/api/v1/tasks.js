const Task = require('../../../models/Task.model')
const { BadRequest } = require('http-errors')
const utils = require('../../../utils')

module.exports = function (fastify, opts, done) {
    fastify.get('/all/:userId', async (req, reply) => {
        let filterValues = {}
        if (req.query.filterByStatus) {
            filterValues.isChecked = req.query.filterValue
        }

        try {
            const tasks = await Task.find({ userId: req.params.userId, ...filterValues }, ['name', 'isChecked'])
            return reply.code(200).send(tasks)
        } catch (error) {
            return utils.returnGeneralError(error, reply)
        }
    })

    fastify.post('/:userId', async (req, reply) => {
        const task = new Task({
            userId: req.params.userId,
            name: req.body.name,
            isChecked: false
        })

        try {
            const savedTask = await task.save()
            if (!savedTask) {
                throw BadRequest("Failed to save the task")
            }

            return reply.code(201).send(savedTask)
        } catch (error) {
            return utils.returnGeneralError(error, reply)
        }
    })

    fastify.patch('/all/:userId', async (req, reply) => {
        try {
            await Task.updateMany({ userId: req.params.userId }, {
                isChecked: req.body.isChecked
            })
            return reply.code(204).send({ success: true })
        } catch (error) {
            return utils.returnGeneralError(error, reply)
        }
    })

    fastify.patch('/:taskId', async (req, reply) => {
        try {
            await Task.findByIdAndUpdate(req.params.taskId, {
                isChecked: req.body.isChecked
            })
            return reply.code(204).send({ success: true })
        } catch (error) {
            return utils.returnGeneralError(error, reply)
        }
    })

    fastify.delete('/all/:userId', async (req, reply) => {
        try {
            await Task.deleteMany({ userId: req.params.userId })
            return reply.code(204).send({ success: true })
        } catch (error) {
            return utils.returnGeneralError(error, reply)
        }
    })

    fastify.delete('/:taskId', async (req, reply) => {
        try {
            await Task.findByIdAndDelete(req.params.taskId)
            return reply.code(204).send({ success: true })
        } catch (error) {
            return utils.returnGeneralError(error, reply)
        }
    })

    done()
}
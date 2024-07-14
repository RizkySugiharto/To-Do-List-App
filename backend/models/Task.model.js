const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    isChecked: {
        type: Boolean,
        required: true
    }
})
TaskSchema.set('validateBeforeSave', true)

const Task = mongoose.model('Task', TaskSchema)

module.exports = Task
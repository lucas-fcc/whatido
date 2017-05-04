'use strict';

const mongoose = require('mongoose');

const TaskSchema = mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    done: {
        type: Boolean,
        default: false
    }
});

const TaskListSchema = mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    tasks: [TaskSchema],
    currentTask: TaskSchema,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    } 
});

module.exports = mongoose.model('tasklist', TaskListSchema);
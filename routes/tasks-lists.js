'use strict';

const express = require('express');
const router = express.Router();

const TaskLists = require('./../models/task-list');

router.route('/')
    /**
    *   @api {get} /api/tasks-lists Tasks Lists Info
    *   @apiGroup Tasks Lists
    *   @apiHeader {String} Authorization Auth Token
    *   @apiHeaderExample {json} Header
    *       {
    *           "Authorization": "JWT xyz.abc.123.hgf"
    *       }
    *   @apiSuccess {Object[]} lists Current User Tasks Lists
    *   @apiSuccess {String} lists.id The ID of a list
    *   @apiSuccess {String} lists.description The description of a list
    *   @apiSuccessExample {json} Success
    *       HTTP/1.1 200 OK
    *       [
    *           {
    *               "id": "1",
    *               "description": "Task List A"
    *           }
    *       ]
    *   @apiErrorExample {json} Unauthorized
    *       HTTP/1.1 401 Unauthorized
    */
    .get((req, res, next) => {

        TaskLists.find({ userId: req.user._id }, '_id description')
            .then(taskLists => {
                res.json(taskLists);
            })
            .catch(err => {
                err.status = 400;
                next(err);
            });

    })

    /**
    *   @api {post} /api/tasks-lists Create a New List
    *   @apiGroup Tasks Lists
    *   @apiHeader {String} Authorization Auth Token
    *   @apiHeaderExample {json} Header
    *       {
    *           "Authorization": "JWT xyz.abc.123.hgf"
    *       }
    *   @apiParam {String} description Description of the new task list
    *   @apiParamExample {json} In
    *       {
    *           "description": "Some description"
    *       }
    *   @apiSuccess {String} message Feedback Message
    *   @apiSuccess {Object} taskList The list created
    *   @apiSuccess {String} taskList._id The ID of the list
    *   @apiSuccess {String} taskList.description The description of the list
    *   @apiSuccessExample {json} Success
    *       HTTP/1.1 200 OK
    *       {
    *           "message": "List Created",
    *           "taskList": {
    *               "_id": "5907be9730c4284b7e72f62e",
    *               "description": "Some description"
    *           }
    *       }
    *   @apiErrorExample {json} Unauthorized
    *       HTTP/1.1 401 Unauthorized
    *   @apiErrorExample {json} Bad Request
    *       HTTP/1.1 400 Bad Request
    *       {
    *           "status": "400"
    *           "message": "tasklist validation failed"
    *       }
    */
    .post((req, res, next) => {

        TaskLists.create({ description: req.body.description, userId: req.user._id })
            .then(taskList => {
                res.json({
                    message: 'List Created',
                    taskList: {
                        _id: taskList._id,
                        description: taskList.description
                    }
                });
            })
            .catch(err => {
                err.status = 400;
                next(err);
            });

    });

router.route('/:listId')
    /**
    *   @api {get} /api/tasks-lists/:id Specific Task List Info
    *   @apiGroup Tasks Lists
    *   @apiHeader {String} Authorization Auth Token
    *   @apiHeaderExample {json} Header
    *       {
    *           "Authorization": "JWT xyz.abc.123.hgf"
    *       }
    *   @apiParam {String} id List ID
    *   @apiSuccess {String} id Task List ID
    *   @apiSuccess {String} description Task List Description
    *   @apiSuccess {Object} currentTask The current task being done
    *   @apiSuccess {String} currentTask.id The current task id
    *   @apiSuccess {String} currentTask.description The current task description
    *   @apiSuccess {Boolean} currentTask.done The current task status
    *   @apiSuccess {Object[]} tasks All the tasks in the list
    *   @apiSuccessExample {json} Success
    *       HTTP/1.1 200 OK
    *       {
    *           "id": "1",
    *           "description": "Task List A",
    *           "currentTask": {
    *               "id": "2",
    *               "description": "Task Z"
    *               "done": "false"
    *           },
    *           "tasks": [
    *               {"id": "1", "description": "Task X", "done": true},
    *               {"id": "2", "description": "Task Z", "done": false}
    *           ]
    *       }
    *   @apiErrorExample {json} Unauthorized
    *       HTTP/1.1 401 Unauthorized
    */
    .get((req, res, next) => {

        TaskLists.findOne({ _id: req.params.listId, userId: req.user._id}, '_id description tasks currentTask')
            .then(taskList => {

                if (!taskList) {
                    const err = new Error('List Invalid');
                    err.status = 400;

                    return next(err);
                }

                res.json(taskList);
            })
            .catch(err => {
                err.status = 400;
                next(err);
            });

    })

    /**
    *   @api {delete} /api/tasks-lists/:id Delete a Task List
    *   @apiGroup Tasks Lists
    *   @apiHeader {String} Authorization Auth Token
    *   @apiHeaderExample {json} Header
    *       {
    *           "Authorization": "JWT xyz.abc.123.hgf"
    *       }
    *   @apiParam {String} id List ID
    *   @apiSuccess {String} message Feedback Message
    *   @apiSuccessExample {json} Success
    *       HTTP/1.1 200 OK
    *       {
    *           "message": "List Deleted",
    *       }
    *   @apiErrorExample {json} Unauthorized
    *       HTTP/1.1 401 Unauthorized
    */
    .delete((req, res, next) => {

        TaskLists.findOneAndRemove({ _id: req.params.listId, userId: req.user._id})
            .then(taskList => {
                res.json({ message: 'List Deleted' });
            })
            .catch(err => {
                err.status = 400;
                next(err);
            });

    })

    /**
    *   @api {patch} /api/tasks-lists/:id Change The Current Task
    *   @apiGroup Tasks Lists
    *   @apiHeader {String} Authorization Auth Token
    *   @apiHeaderExample {json} Header
    *       {
    *           "Authorization": "JWT xyz.abc.123.hgf"
    *       }
    *   @apiParam {String} id List ID
    *   @apiParam {Object} currentTask Current Task Data
    *   @apiParam {String} currentTask.old The old current task
    *   @apiParam {String} currentTask.new The new current task
    *   @apiParamExample {json} In
    *       {
    *           "currentTask": {
    *               "old": {"id": "1"},
    *               "new": {"id": "2"}
    *           }
    *       }
    *   @apiSuccess {String} message Feedback Message
    *   @apiSuccessExample {json} Success
    *       HTTP/1.1 200 OK
    *       {
    *           "message": "Current Task Changed"
    *       }
    *   @apiErrorExample {json} Unauthorized
    *       HTTP/1.1 401 Unauthorized
    *   @apiErrorExample {json} Bad Request
    *       HTTP/1.1 400 Bad Request
    *       {
    *           "error": "400",
    *           "message": "data invalid"
    *       }
    */
    .patch((req, res, next) => {

        TaskLists.findOne({ _id: req.params.listId, userId: req.user._id})
            .then(taskList => {

                if (taskList.currentTask && taskList.currentTask._id != req.body.currentTask.old._id) {
                    const err = new Error('Data Invalid');
                    err.status = 400;

                    return next(err);
                }

                taskList.currentTask = req.body.currentTask.new;

                taskList.save()
                    .then(taskListUpdated => {
                        res.json({ message: 'Current Task Changed', taskList: taskListUpdated });
                    })
                    .catch(err => {
                        console.log(err.message);

                        err.status = 400;
                        next(err);
                    });

            })
            .catch(err => {
                console.log(err.message);

                err.status = 400;
                next(err);
            });


    });

router.route('/:listId/tasks')

    /**
    *   @api {post} /api/tasks-lists/:listId/tasks Create a New Task
    *   @apiGroup Tasks
    *   @apiHeader {String} Authorization Auth Token
    *   @apiHeaderExample {json} Header
    *       {
    *           "Authorization": "JWT xyz.abc.123.hgf"
    *       }
    *   @apiParam {String} listId List ID
    *   @apiParam {String} description Description of the new task
    *   @apiParamExample {json} In
    *       {
    *           "description": "Some description"
    *       }
    *   @apiSuccess {String} message Feedback Message
    *   @apiSuccessExample {json} Success
    *       HTTP/1.1 200 OK
    *       {
    *           "message": "Task Created"
    *       }
    *   @apiErrorExample {json} Unauthorized
    *       HTTP/1.1 401 Unauthorized
    *   @apiErrorExample {json} Bad Request
    *       HTTP/1.1 400 Bad Request
    *       {
    *           "status": "400",
    *           "message": "task list validation failed"
    *       }
    */
    .post((req, res, next) => {

        TaskLists.findOne({ _id: req.params.listId, userId: req.user._id})
            .then(taskList => {

                if (!taskList) {
                    const err = new Error('List Invalid');
                    err.status = 400;

                    return next(err);
                }

                taskList.tasks.push(req.body);

                taskList.save()
                    .then(taskListUpdated => {
                        res.json({ message: 'Task Created', taskList: taskListUpdated });
                    })
                    .catch(err => {
                        err.status = 400;
                        next(err);
                    });

            })
            .catch(err => {
                err.status = 400;
                next(err);
            });

    });

router.route('/:listId/tasks/:taskId')
    /**
    *   @api {delete} /api/tasks-lists/:listId/tasks/:taskId Delete a Task
    *   @apiGroup Tasks
    *   @apiHeader {String} Authorization Auth Token
    *   @apiHeaderExample {json} Header
    *       {
    *           "Authorization": "JWT xyz.abc.123.hgf"
    *       }
    *   @apiParam {String} listId List ID
    *   @apiParam {String} taskId Task ID
    *   @apiSuccessExample {json} Success
    *       HTTP/1.1 200 OK
    *       {
    *           "message": "Task Deleted",
    *       }
    *   @apiErrorExample {json} Unauthorized
    *       HTTP/1.1 401 Unauthorized
    */
    .delete((req, res, next) => {

        TaskLists.findOne({ _id: req.params.listId, userId: req.user._id})
            .then(taskList => {

                taskList.tasks.id(req.params.taskId).remove();

                taskList.save()
                    .then(taskListUpdated => {
                        res.json({ message: 'Task Deleted'});
                    })
                    .catch(err => {
                        err.status = 400;
                        next(err);
                    });

            })
            .catch(err => {
                err.status = 400;
                next(err);
            });

    })

    /**
    *   @api {patch} /api/tasks-lists/:listId/tasks/:taskId Check Tasks
    *   @apiGroup Tasks
    *   @apiHeader {String} Authorization Auth Token
    *   @apiHeaderExample {json} Header
    *       {
    *           "Authorization": "JWT xyz.abc.123.hgf"
    *       }
    *   @apiParam {String} listId List ID
    *   @apiParam {String} taskId Task ID
    *   @apiParam {Object} done Task Done Data
    *   @apiParam {String} done.old The old value
    *   @apiParam {String} done.new The new value
    *   @apiParamExample {json} In
    *       {
    *           "done": {
    *               "old": false,
    *               "new": true
    *           }
    *       }
    *   @apiSuccess {String} message Feedback Message
    *   @apiSuccessExample {json} Success
    *       HTTP/1.1 200 OK
    *       {
    *           "message": "Task done"
    *       }
    *   @apiErrorExample {json} Unauthorized
    *       HTTP/1.1 401 Unauthorized
    *   @apiErrorExample {json} Bad Request
    *       HTTP/1.1 400 Bad Request
    *       {
    *           "error": "400",
    *           "message": "data invalid"
    *       }
    */
    .patch((req, res, next) => {

        TaskLists.findOne({ _id: req.params.listId, userId: req.user._id})
            .then(taskList => {

                const task = taskList.tasks.id(req.params.taskId);

                if (task.done != req.body.done.old) {
                    const err = new Error('Data Invalid');
                    err.status = 400;

                    return next(err);
                }

                task.done = req.body.done.new;

                taskList.save()
                    .then(taskListUpdated => {
                        const message = task.done ? 'Task Done' : 'Task Undone';

                        res.json({ message: message, taskList: taskListUpdated });
                    })
                    .catch(err => {
                        err.status = 400;
                        next(err);
                    });

            })
            .catch(err => {
                err.status = 400;
                next(err);
            });

    });

module.exports = router;
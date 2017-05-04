'use strict';

const chai = require('chai');
const chaiHtpp = require('chai-http');
const server = require('./../../server');
const assert = chai.assert;

const TaskList = require('./../../models/task-list');
const User = require('./../../models/user');

chai.use(chaiHtpp);

let token;

describe('/api/tasks-lists', () => {

    before(done => {
        User.create({ name: 'user01', email: 'user@user.com', password: '12345' })
            .then(user => {
                
                chai.request(server)
                    .post('/api/users/login')
                    .send({ email: 'user@user.com', password: '12345' })
                    .end((err, res) => {

                        token = res.body.token;

                        done();

                    });

            })
            .catch(err => {
                throw err;
            });
    });

    beforeEach(done => {
        TaskList.remove({}).then(() => done());
    });

    describe('/', () => {

        describe('GET', () => {

            it('when receives a request returns all the task lists of the logged user', done => {

                chai.request(server)
                    .get('/api/tasks-lists/')
                    .set('Authorization', `JWT ${token}`)
                    .end((err, res) => {

                        assert.strictEqual(res.status, 200);
                        assert.isArray(res.body);
                        done();

                    });

            });

        });

        describe('POST', () => {

            it('when receives a valid request creates a new task list', done => {

                chai.request(server)
                    .post('/api/tasks-lists/')
                    .set('Authorization', `JWT ${token}`)
                    .send({ description: 'List 01' })
                    .end((err, res) => {

                        assert.strictEqual(res.status, 200);
                        assert.property(res.body, 'message');
                        assert.property(res.body, 'taskList');
                        assert.isObject(res.body.taskList);
                        assert.property(res.body.taskList, '_id');
                        assert.property(res.body.taskList, 'description');
                        assert.strictEqual(res.body.taskList.description, 'List 01');
                        done();

                    });

            });

            it('when receives an invalid request do not create a new task list', done => {

                chai.request(server)
                    .post('/api/tasks-lists/')
                    .set('Authorization', `JWT ${token}`)
                    .end((err, res) => {

                        assert.strictEqual(res.status, 400);
                        assert.property(res.body, 'message');
                        assert.notProperty(res.body, 'taskList');
                        
                        done();

                    });

            });

        });

    });

    describe('/:listId', () => {

        describe('GET', () => {

            it('when receives a valid request returns the information about a specific list', done => {

                chai.request(server)
                    .post('/api/tasks-lists/')
                    .set('Authorization', `JWT ${token}`)
                    .send({ description: 'List 01' })
                    .end((err, res) => {

                        assert.strictEqual(res.status, 200);
                        assert.property(res.body, 'taskList');

                        const listId = res.body.taskList._id;
                        
                        chai.request(server)
                            .get(`/api/tasks-lists/${listId}`)
                            .set('Authorization', `JWT ${token}`)
                            .end((err, res) => {

                                assert.strictEqual(res.status, 200);
                                assert.property(res.body, '_id');
                                assert.property(res.body, 'description');
                                assert.property(res.body, 'tasks');
                                assert.isArray(res.body.tasks);

                                done();

                            });

                    });

            });

            it('when receives an invalid request returns an error message', done => {

                chai.request(server)
                    .get(`/api/tasks-lists/59078925454e08314b0d2245`)
                    .set('Authorization', `JWT ${token}`)
                    .end((err, res) => {

                        assert.strictEqual(res.status, 400);
                        assert.property(res.body, 'message');
                        assert.notProperty(res.body, '_id');

                        done();

                    });

            });

        });

        describe('DELETE', () => {

            it('when receives a valid request delete a specific list', done => {

                chai.request(server)
                    .post('/api/tasks-lists/')
                    .set('Authorization', `JWT ${token}`)
                    .send({ description: 'List 01' })
                    .end((err, res) => {

                        assert.strictEqual(res.status, 200);
                        assert.property(res.body, 'taskList');

                        const listId = res.body.taskList._id;
                        
                        chai.request(server)
                            .delete(`/api/tasks-lists/${listId}`)
                            .set('Authorization', `JWT ${token}`)
                            .end((err, res) => {

                                assert.strictEqual(res.status, 200);
                                assert.property(res.body, 'message');

                                done();

                            });

                    });

            });

            it('when receives an invalid request do not delete', done => {

                chai.request(server)
                    .get(`/api/tasks-lists/59078925454e08314b0d2245`)
                    .set('Authorization', `JWT ${token}`)
                    .end((err, res) => {

                        assert.strictEqual(res.status, 400);
                        assert.property(res.body, 'message');

                        done();

                    });

            });

        });

        describe('PATCH', () => {

            it('when receives a valid request updates the current task', done => {

                chai.request(server)
                    .post('/api/tasks-lists/')
                    .set('Authorization', `JWT ${token}`)
                    .send({ description: 'List 01' })
                    .end((err, res) => {

                        assert.strictEqual(res.status, 200);
                        assert.property(res.body, 'taskList');

                        const listId = res.body.taskList._id;
                        
                        chai.request(server)
                            .post(`/api/tasks-lists/${listId}/tasks`)
                            .set('Authorization', `JWT ${token}`)
                            .send({ description: 'Task 01' })
                            .end((err, res) => {

                                assert.strictEqual(res.status, 200);
                                assert.property(res.body, 'taskList');

                                const taskId = res.body.taskList.tasks[0]._id;
                                const currentTaskData = {
                                    old: res.body.taskList.currentTask,
                                    new: res.body.taskList.tasks[0]
                                };

                                chai.request(server)
                                    .patch(`/api/tasks-lists/${listId}`)
                                    .set('Authorization', `JWT ${token}`)
                                    .send({ currentTask: currentTaskData })
                                    .end((err, res) => {

                                        assert.strictEqual(res.status, 200);
                                        assert.property(res.body, 'message');
                                        assert.property(res.body, 'taskList');
                                        assert.strictEqual(res.body.taskList.currentTask._id, currentTaskData.new._id);

                                        done();

                                    });

                            });

                    });

            });

        });

    });

    describe('/:listId/tasks', () => {

        describe('POST', () => {

            it('when receives a valid request creates a new task', done => {

                chai.request(server)
                    .post('/api/tasks-lists/')
                    .set('Authorization', `JWT ${token}`)
                    .send({ description: 'List 01' })
                    .end((err, res) => {

                        assert.strictEqual(res.status, 200);
                        assert.property(res.body, 'taskList');

                        const listId = res.body.taskList._id;
                        
                        chai.request(server)
                            .post(`/api/tasks-lists/${listId}/tasks`)
                            .set('Authorization', `JWT ${token}`)
                            .send({ description: 'Task 01' })
                            .end((err, res) => {

                                assert.strictEqual(res.status, 200);
                                assert.property(res.body, 'message');
                                assert.property(res.body, 'taskList');
                                assert.isObject(res.body.taskList);
                                assert.property(res.body.taskList, 'tasks');
                                assert.isArray(res.body.taskList.tasks);
                                assert.lengthOf(res.body.taskList.tasks, 1);

                                done();

                            });

                    });

            });

            it('when receives an invalid request do not create a new task', done => {

                chai.request(server)
                    .post('/api/tasks-lists/')
                    .set('Authorization', `JWT ${token}`)
                    .send({ description: 'List 01' })
                    .end((err, res) => {

                        assert.strictEqual(res.status, 200);
                        assert.property(res.body, 'taskList');

                        const listId = res.body.taskList._id;
                        
                        chai.request(server)
                            .post(`/api/tasks-lists/${listId}/tasks`)
                            .set('Authorization', `JWT ${token}`)
                            .end((err, res) => {

                                assert.strictEqual(res.status, 400);
                                assert.property(res.body, 'message');

                                done();

                            });

                    });

            });

        });

    });

    describe('/:listId/tasks/:taskId', () => {

        describe('DELETE', () => {

            it('when receives a valid request deletes a task', done => {

                chai.request(server)
                    .post('/api/tasks-lists/')
                    .set('Authorization', `JWT ${token}`)
                    .send({ description: 'List 01' })
                    .end((err, res) => {

                        assert.strictEqual(res.status, 200);
                        assert.property(res.body, 'taskList');

                        const listId = res.body.taskList._id;
                        
                        chai.request(server)
                            .post(`/api/tasks-lists/${listId}/tasks`)
                            .set('Authorization', `JWT ${token}`)
                            .send({ description: 'Task 01' })
                            .end((err, res) => {

                                assert.strictEqual(res.status, 200);
                                assert.property(res.body, 'taskList');

                                const taskId = res.body.taskList.tasks[0]._id;

                                chai.request(server)
                                    .delete(`/api/tasks-lists/${listId}/tasks/${taskId}`)
                                    .set('Authorization', `JWT ${token}`)
                                    .end((err, res) => {

                                        assert.strictEqual(res.status, 200);
                                        assert.property(res.body, 'message');

                                        done();

                                    });

                            });

                    });

            });

            it('when receives an invalid request do not delete a task', done => {

                chai.request(server)
                    .post('/api/tasks-lists/')
                    .set('Authorization', `JWT ${token}`)
                    .send({ description: 'List 01' })
                    .end((err, res) => {

                        assert.strictEqual(res.status, 200);
                        assert.property(res.body, 'taskList');

                        const listId = res.body.taskList._id;
                        
                        chai.request(server)
                            .post(`/api/tasks-lists/${listId}/tasks`)
                            .set('Authorization', `JWT ${token}`)
                            .send({ description: 'Task 01' })
                            .end((err, res) => {

                                assert.strictEqual(res.status, 200);
                                assert.property(res.body, 'taskList');

                                const taskId = '5907aae88aa5b63f390ea40a'; // invalid

                                chai.request(server)
                                    .delete(`/api/tasks-lists/${listId}/tasks/${taskId}`)
                                    .set('Authorization', `JWT ${token}`)
                                    .end((err, res) => {

                                        assert.strictEqual(res.status, 400);
                                        assert.property(res.body, 'message');

                                        done();

                                    });

                            });

                    });

            });

        });

        describe('PATCH', () => {

            it('when receives a valid request updates the state of task', done => {

                chai.request(server)
                    .post('/api/tasks-lists/')
                    .set('Authorization', `JWT ${token}`)
                    .send({ description: 'List 01' })
                    .end((err, res) => {

                        assert.strictEqual(res.status, 200);
                        assert.property(res.body, 'taskList');

                        const listId = res.body.taskList._id;
                        
                        chai.request(server)
                            .post(`/api/tasks-lists/${listId}/tasks`)
                            .set('Authorization', `JWT ${token}`)
                            .send({ description: 'Task 01' })
                            .end((err, res) => {

                                assert.strictEqual(res.status, 200);
                                assert.property(res.body, 'taskList');

                                const taskId = res.body.taskList.tasks[0]._id;
                                const taskDoneData = {
                                    old: res.body.taskList.tasks[0].done,
                                    new: !res.body.taskList.tasks[0].done
                                };

                                chai.request(server)
                                    .patch(`/api/tasks-lists/${listId}/tasks/${taskId}`)
                                    .set('Authorization', `JWT ${token}`)
                                    .send({ done: taskDoneData })
                                    .end((err, res) => {

                                        assert.strictEqual(res.status, 200);
                                        assert.property(res.body, 'message');
                                        assert.property(res.body, 'taskList');
                                        assert.strictEqual(res.body.taskList.tasks[0].done, taskDoneData.new);

                                        done();

                                    });

                            });

                    });

            });

        });

    });



});
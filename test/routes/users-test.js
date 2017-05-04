'use strict';

const chai = require('chai');
const chaiHtpp = require('chai-http');
const server = require('./../../server');
const assert = chai.assert;
const User = require('./../../models/user');

chai.use(chaiHtpp);

describe('/api/users', () => {

    beforeEach(done => {
        User.remove({}).then(() => done());
    });

    after(done => {
        User.remove({}).then(() => done());
    });

    describe('/', () => {

        describe('POST', () => {

            it('when receives a valid request registers the new user', done => {

                chai.request(server)
                    .post('/api/users')
                    .send({ name: 'user01', email: 'user01@user01.com', password: '12345' })
                    .end((err, res) => {

                        assert.strictEqual(res.status, 200);
                        assert.property(res.body, 'message');
                        assert.property(res.body, 'user');
                        assert.isObject(res.body.user);
                        assert.property(res.body.user, '_id');
                        assert.property(res.body.user, 'name');
                        assert.strictEqual(res.body.user.name, 'user01');
                        assert.property(res.body.user, 'email');
                        assert.strictEqual(res.body.user.email, 'user01@user01.com');

                        done();

                    });

            });

            it('when receives a request without the parameters needed do not register a new user', done => {

                chai.request(server)
                    .post('/api/users')
                    .send({})
                    .end((err, res) => {

                        assert.strictEqual(res.status, 400);
                        assert.property(res.body, 'message');
                        assert.notProperty(res.body, 'user');

                        done();

                    });

            });

            it('when receives a request with an email already registered do not register a new user', done => {

                chai.request(server)
                    .post('/api/users')
                    .send({ name: 'user01', email: 'user01@user01.com', password: '12345' })
                    .end((err, res) => {

                        assert.strictEqual(res.status, 200);
                        assert.property(res.body, 'user');

                        chai.request(server)
                            .post('/api/users')
                            .send({ name: 'otherUser', email: 'user01@user01.com', password: '12345' })
                            .end((err, res) => {

                                assert.strictEqual(res.status, 400);
                                assert.property(res.body, 'message');
                                assert.notProperty(res.body, 'user');

                                done();

                            });

                    });

            });

        });

        describe('PATCH', () => {

            it('when receives a valid information, changes the user password', done => {


                chai.request(server)
                    .post('/api/users')
                    .send({ name: 'user01', email: 'user01@user01.com', password: '12345' })
                    .end((err, res) => {

                        assert.strictEqual(res.status, 200);
                        assert.property(res.body, 'user');

                        chai.request(server)
                            .post('/api/users/login')
                            .send({ email: 'user01@user01.com', password: '12345' })
                            .end((err, res) => {

                                assert.strictEqual(res.status, 200);
                                assert.property(res.body, 'user');
                                assert.property(res.body, 'token');

                                const token = res.body.token;
                                const passwordInfo = {
                                    old: '12345',
                                    new: 'newPassword'
                                };

                                chai.request(server)
                                    .patch('/api/users')
                                    .set('Authorization', `JWT ${token}`)
                                    .send({ password: passwordInfo })
                                    .end((err, res) => {

                                        assert.strictEqual(res.status, 200);
                                        assert.property(res.body, 'message');
                                        done();

                                    });

                            });

                    });

            });

            it('when receives an incorrect old password do not change the user password', done => {


                chai.request(server)
                    .post('/api/users')
                    .send({ name: 'user01', email: 'user01@user01.com', password: '12345' })
                    .end((err, res) => {

                        assert.strictEqual(res.status, 200);
                        assert.property(res.body, 'user');

                        chai.request(server)
                            .post('/api/users/login')
                            .send({ email: 'user01@user01.com', password: '12345' })
                            .end((err, res) => {

                                assert.strictEqual(res.status, 200);
                                assert.property(res.body, 'user');
                                assert.property(res.body, 'token');

                                const token = res.body.token;
                                const passwordInfo = {
                                    old: 'incorrectPassword',
                                    new: 'newPassword'
                                };

                                chai.request(server)
                                    .patch('/api/users')
                                    .set('Authorization', `JWT ${token}`)
                                    .send({ password: passwordInfo })
                                    .end((err, res) => {

                                        assert.strictEqual(res.status, 400);
                                        assert.property(res.body, 'message');
                                        done();

                                    });

                            });

                    });

            });

        });

    });

    describe('/login', () => {

        it('when receives valid credentials returns a token', (done) => {

            chai.request(server)
                .post('/api/users')
                .send({ name: 'user01', email: 'user01@user01.com', password: '12345' })
                .end((err, res) => {

                    assert.strictEqual(res.status, 200);
                    assert.property(res.body, 'user');

                    chai.request(server)
                        .post('/api/users/login')
                        .send({ email: 'user01@user01.com', password: '12345' })
                        .end((err, res) => {

                            assert.strictEqual(res.status, 200);
                            assert.property(res.body, 'user');
                            assert.property(res.body, 'token');

                            done();

                        });

                });

        });

        it('when receives invalid credentials do not return a token', (done) => {

            chai.request(server)
                .post('/api/users/login')
                .send({ email: 'invalid@invalid.com', password: 'invalid' })
                .end((err, res) => {

                    assert.strictEqual(res.status, 400);
                    assert.notProperty(res.body, 'user');
                    assert.notProperty(res.body, 'token');
                    assert.property(res.body, 'message');

                    done();

                });

        });

    });

    describe('/recover-password', () => {

        it('when receives a registered email recovers the password', (done) => {

            chai.request(server)
                .post('/api/users')
                .send({ name: 'user01', email: 'user01@user01.com', password: '12345' })
                .end((err, res) => {

                    assert.strictEqual(res.status, 200);
                    assert.property(res.body, 'user');

                    chai.request(server)
                        .get('/api/users/recover-password')
                        .query({ email: 'user01@user01.com' })
                        .end((err, res) => {

                            assert.strictEqual(res.status, 200);
                            assert.property(res.body, 'message');

                            done();

                        });

                });

        });

        it('when receives an email not registered returns an error message', (done) => {

            chai.request(server)
                .get('/api/users/recover-password')
                .query({ email: 'invalid@invalid.com' })
                .end((err, res) => {

                    assert.strictEqual(res.status, 400);
                    assert.property(res.body, 'message');

                    done();

                });

        });

    });

});
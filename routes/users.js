'use strict';

const express = require('express');
const router = express.Router();
const auth = require('./../config/auth');
const passport = require('./../config/passport');
const mailTransporter = require('./../config/mailer');

const User = require('./../models/user');

router.route('/')
    /**
    *   @api {post} /user User Registration
    *   @apiGroup Users
    *   @apiParam {String} name Name
    *   @apiParam {String} email Email
    *   @apiParam {String} password Password
    *   @apiParamExample {json} In
    *       {
    *           "name": "username",
    *           "email": "user@mail.com"
    *           "password": "password"
    *       }
    *   @apiSuccess {String} message Feedback Message
    *   @apiSuccessExample {json} Success
    *       HTTP/1.1 200 OK
    *       {
    *           "message": "User Registered",
    *           "user": {
    *               "_id": "5907bb8730c4284b7e72f62d",
    *               "name": "username",
    *               "email": "user@mail.com",
    *           }
    *       }
    *   @apiErrorExample {json} Bad Request
    *       HTTP/1.1 400 Bad Request
    *       {
    *           "status": 400,
    *           "message": "validation failed"
    *       }
    */
    .post((req, res, next) => {

        User.create(req.body)
            .then(user => {
                res.json({
                    message: 'User Registered',
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email
                    }
                });
            })
            .catch(err => {
                err.status = 400;
                next(err);
            });

    })
    
    /**
    *   @api {patch} /user Change Password
    *   @apiGroup Users
    *   @apiHeader {String} Authorization Auth Token
    *   @apiHeaderExample {json} Header
    *       {
    *           "Authorization": "JWT xyz.abc.123.hgf"
    *       }
    *   @apiParam {Object} password Password data
    *   @apiParam {String} password.old The old password
    *   @apiParam {String} password.new The new password
    *   @apiParamExample {json} In
    *       {
    *           "password": {
    *               "old": "oldPassword",
    *               "new": "newPassword"
    *           }
    *       }
    *   @apiSuccess {String} message Feedback Message
    *   @apiSuccessExample {json} Success
    *       HTTP/1.1 200 OK
    *       {
    *           "message": "Password Changed"
    *       }
    *   @apiErrorExample {json} Unauthorized
    *       HTTP/1.1 401 Unauthorized
    *   @apiErrorExample {json} Bad Request
    *       HTTP/1.1 400 Bad Request
    *       {
    *           "status": "400"
    *           "message": "The old password did not match"
    *       }
    */
    .patch(passport.authenticate('jwt', { session: false }), (req, res, next) => {

        if (req.user.password !== req.body.password.old) {
            const err = new Error('The old password did not match');
            err.status = 400;

            return next(err);
        }

        User.findByIdAndUpdate(req.user._id, { $set: { password: req.body.password.new } }, { new: true })
            .then(user => {
                res.json({ message: 'Password Changed' });
            })
            .then(err => {
                next(err);
            });

    });

/**
*   @api {get} /users?email Password Recover
*   @apiGroup Users
*   @apiParam {String} email Email Registered
*   @apiSuccess {String} message Feedback Message
*   @apiSuccessExample {json} Success
*       HTTP/1.1 200 OK
*       {
*           "message": "Password recovered, please check your email box"
*       }
*   @apiErrorExample {json} Bad Request
*       HTTP/1.1 400 Bad Request
*       {
*           "status": "400",
*           "error": "The email informed is not registered"
*       }
*/
router.get('/recover-password', (req, res, next) => {
  
    User.findOne({ email: req.query.email })
        .then(user => {

            if (!user) {
                const err = new Error('The email informed is not registered');
                err.status = 400;

                return next(err);
            }

            let mailOptions = {
                from: '"WhatIDo?!" <app.whatido@gmail.com>',
                to: user.email,
                subject: 'Recovering Password',
                template: 'mail-recover',
                context: {
                    email: user.email,
                    password: user.password
                }
            };

            mailTransporter.sendMail(mailOptions, (err, info) => {

                if (err) {
                    err.status = 400;
                    return next(err);
                }

                res.json({ message: 'Password recovered, please check your email box'});

            });

        })
        .catch(err => {
            next(err);
        });
  
});

/**
*   @api {post} /users/login Login
*   @apiGroup Users
*   @apiParam {String} email Email
*   @apiParam {String} password Password
*   @apiParamExample {json} In
*       {
*           "email": "user@mail.com",
*           "password": "password"
*       }
*   @apiSuccess {Object} user User Info
*   @apiSuccess {String} user.id User ID
*   @apiSuccess {String} user.name Username
*   @apiSuccess {String} token Authentication Token
*   @apiSuccessExample {json} Success
*       HTTP/1.1 200 OK
*       {
*           "user": {
*               "_id": "5907bb8730c4284b7e72f62d",
*               "name": "username",
*               "email": "user@mail.com",
*           }
*           "token": "xyz.abc.123.hgf"
*       }
*   @apiErrorExample {json} Authentication Error
*       HTTP/1.1 400 Bad Request
*       {
*           "status": "400",
*           "message": "Email or Password Invalid"
*       }
*/
router.post('/login', (req, res, next) => {
  
    auth.login(req.body.email, req.body.password, (err, data) => {
        if (err) return next(err);
        
        res.json(data);
    });
  
});

module.exports = router;
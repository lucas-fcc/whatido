'use strict';

const jwt = require('jsonwebtoken');
const User = require('./../models/user');

function login(email, password, callback) {
  
    User.findOne({ email, password })
        .then(user => {

            if (!user) {
                const err = new Error('Email or Password Invalid');
                err.status = 400;

                return callback(err);
            }

            const token = jwt.sign({ _id: user._id }, process.env.PASSPORT_SECRET, { expiresIn: 1200 });

            const userRes = {
                _id: user._id,
                name: user.name,
                email: user.email
            };

            return callback(null, { user: userRes, token: token });

        })
        .catch(err => {

            err.status = 400;
            return callback(err);

        });
  
};

module.exports = { login };

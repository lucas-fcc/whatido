'use strict';

const passport = require('passport');
const passportJwt = require('passport-jwt');

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const User = require('./../models/user');

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: process.env.PASSPORT_SECRET
};

const jwtStrategy = new JwtStrategy(jwtOptions, (payload, next) => {

    User.findById(payload._id)
        .then(user => {
            return next(null, user);
        })
        .catch(err => {
            return next(null, false, { message: err.message });
        });
  
});

passport.use(jwtStrategy);

module.exports = passport;
'use strict';

const mongoose = require('mongoose');

module.exports = function() {

    let dbHost = process.env.DB_HOST || 'localhost';
    let dbName;

    if (process.env.NODE_ENV && process.env.NODE_ENV==='test') {
        dbName = 'wid-test';
    } else {
        dbName = process.env.DB_NAME || 'wid';
    }

    const uri = `mongodb://${dbHost}/${dbName}`;

    mongoose.connect(uri);
    mongoose.Promise = global.Promise;

    mongoose.connection.on('connected', () => {
        console.log(`Database connected to: ${uri}`);
    });

    mongoose.connection.on('disconnected', () => {
        console.log(`Database disconnected from: ${uri}`);
    });

    mongoose.connection.on('error', err => {
        console.log(`Database error on connection: ${err}`);
    });

    process.on('SIGINT', () => {

        mongoose.connection.close(() => {
            console.log('Database disconnected due the end of application');
            process.exit(0);
        });

    });

};
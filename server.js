'use strict';

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('./config/passport');

require('./config/database')();

const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(passport.initialize());

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/tasks-lists', passport.authenticate('jwt', { session: false }), require('./routes/tasks-lists'));

app.get("/ok", (req, res) => {
    res.json({ ok: true });
});

// Error Handlers
app.use((req, res, next) => {
	res.status(404).json({ status: 404, message: 'Not Found' });
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ status: err.status, message: err.message });
});

const listener = app.listen(process.env.PORT, () => {
    console.log(`Your app is listening on port ${listener.address().port}`);
});

module.exports = app;

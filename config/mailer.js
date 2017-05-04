'use strict';

const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

const smtpUri = `smtps://${process.env.SMTP_USER}:${process.env.SMTP_KEY}@${process.env.SMTP_SERVER}`;

let transporter = nodemailer.createTransport(smtpUri);

/*let transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: 'agendatarefas@outlook.com',
        pass: 'projetoagenda1'
    }
});*/

transporter.use('compile', hbs({ viewPath: 'views', extName: '.hbs' }));

module.exports = transporter;
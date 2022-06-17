const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');

const operations = {};

const transporter = nodemailer.createTransport({
    host: 'smtpout.secureserver.net',
    secure: true,
    port: 465,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
    },
});

const getTemplate = (filename, body) => {
    const emailTemplatePath = path.join(__dirname, 'dir/email_templates', filename);
    const template = fs.readFileSync(emailTemplatePath, { encoding: 'utf-8' });
    return ejs.render(template, body);
};

operations.send = (body, callback) => {
    let filename = '';
    let subject = '';
    if (body.type === 'forgotPassword') {
        filename = 'forgot_password.html';
        subject = 'Meta Tank Reset Password';
    }
    const template = getTemplate(filename, body);
    operations.sendEmail(template, subject, body, callback);
};

operations.sendEmail = (template, subject, body, callback) => {
    transporter.sendMail(
        {
            from: process.env.SMTP_EMAIL,
            to: body.sEmail,
            subject,
            html: template,
        },
        error => {
            if (error) return callback(error);
            callback();
        }
    );
};

module.exports = operations;

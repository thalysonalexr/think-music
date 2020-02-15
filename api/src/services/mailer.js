const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

const {
  TM_MAIL_HOST,
  TM_MAIL_PORT,
  TM_MAIL_USER,
  TM_MAIL_PASS
} = process.env;

const transport = nodemailer.createTransport({
  host: TM_MAIL_HOST,
  port: TM_MAIL_PORT,
  auth: {
    user: TM_MAIL_USER,
    pass: TM_MAIL_PASS
  }
});

transport.use('compile', hbs({
  viewEngine: {
    extName: '.html',
    layoutsDir: null,
    defaultLayout: null,
    partialsDir: path.resolve('./src/resources/mail/')
  },
  viewPath: path.resolve('./src/resources/mail/'),
  extName: '.html'
}));

module.exports = transport;

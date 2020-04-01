import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';

import config from '../config/mailer';

export class Mailer {
  constructor() {
    const { host, port, auth: { user, pass } } = config;
    
    this.transporter = nodemailer.createTransport({
      host,
      port,
      auth: {
        user,
        pass
      }
    });

    this.configureTemplates();
  }

  configureTemplates() {
    const viewPath = path.resolve('./src/resources/mail/');

    this.transporter.use('compile', hbs({
      viewEngine: {
        extName: '.html',
        layoutsDir: null,
        defaultLayout: null,
        partialsDir: path.resolve(viewPath)
      },
      viewPath,
      extName: '.html'
    }));
  }

  sendMail(message) {
    return this.transporter.sendMail({
      ...config.default,
      ...message
    });
  }
}

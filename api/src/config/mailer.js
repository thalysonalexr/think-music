export default {
  host: process.env.TM_MAIL_HOST,
  port: process.env.TM_MAIL_PORT,
  auth: {
    user: process.env.TM_MAIL_USER,
    pass: process.env.TM_MAIL_PASS,
  },
  default: {
    from: "Think Music <noreply@thinkmusic.com>",
  },
};

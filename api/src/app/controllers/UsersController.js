const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../services/mailer');

const User = require('../models/User');

const generateToken = (params = {}) => {
  return jwt.sign(params, process.env.TM_SECRET, {
    expiresIn: 86400
  });
}

module.exports = {
  async auth (req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email }).select('+password');
      
      if ( ! user) {
        return res.status(400).json({
          error: 404,
          password: 'User not exists.'
        });
      }

      if ( ! await bcrypt.compare(password, user.password)) {
        return res.status(401).json({
          error: 401,
          message: 'Password is incorrect.'
        });
      }

      user.password = undefined;

      const token = generateToken({ id: user._id });

      return res.status(200).json({ user, token });
    } catch (err) {
      return res.status(500).json({
        error: 500,
        message: 'Failed authenticate.'
      });
    }
  },

  async store (req, res) {
    const { email } = req.body;

    try {
      if (await User.findOne({ email })) {
        return res.status(409).json({
          error: 409,
          message: 'User already exists.'
        });
      }

      const user = await User.create(req.body);

      user.password = undefined;
      
      const token = generateToken({ id: user._id });

      return res.status(201).json({ user, token });
    } catch (err) {
      return res.status(400).json({
        error: 400,
        message: 'Bad Request.'
      });
    }
  },

  async forgotPassword (req, res) {
    const { email } = req.body;

    if ( ! email) {
      return res.status(400).json({
        error: 400,
        message: 'Set e email in request.'
      });
    }

    try {
      const user = await User.findOne({ email });

      if ( ! user) {
        return res.status(404).json({
          error: 404,
          message: 'User not found.'
        });
      }

      const token = crypto.randomBytes(20).toString('hex');

      const now = new Date();
      now.setHours(now.getHours() + 1);

      await User.findByIdAndUpdate(user._id, {
        '$set': {
          passwordResetToken: token,
          passwordResetExpires: now
        }
      });

      mailer.sendMail({
        to: email,
        from: 'support@thinkmusic.com',
        template: 'auth/forgot_password',
        context: { token }
      }, (err) => {
        if (err) {
          return res.status(500).json({
            error: 500,
            message: 'Cannot send forgot password email.'
          });
        }

        return res.status(204).end();
      });

    } catch (err) {
      res.status(500).json({
        error: 500,
        message: 'Error on forgot password, try again later.'
      });
    }
  },

  async resetPassword (req, res) {
    const { email, token, password } = req.body;

    try {
      const user = await User.findOne({ email })
        .select('+passwordResetToken passwordResetExpires');

      if ( ! user) {
        return res.status(404).json({
          error: 404,
          message: 'User not found.'
        });
      }

      if (token !== user.passwordResetToken) {
        return res.status(401).json({
          error: 401,
          message: 'Token invalid.'
        });
      }

      const now = new Date();

      if (now > user.passwordResetToken) {
        return res.status(401).json({
          error: 401,
          message: 'Token expired. Generate a new one.'
        });
      }

      user.password = password;

      await user.save();

      return res.status(204).end();

    } catch (err) {
      return res.status(500).json({
        error: 500,
        message: 'Cannot reset password, try again.'
      });
    }
  }
}

import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import mailer from '../../services/mailer';

import User from '../models/User';
import RevokedTokens from '../models/RevokedToken';

const generateToken = (params = {}) => {
  return jwt.sign(params, process.env.TM_SECRET, {
    expiresIn: 86400
  });
}

const isAdmin = async (id) => {
  const user = await User.findOne({ where: {
    id, role: 'admin'
  } });

  if (user)
    return user.role === 'admin';

  return false;
}

export default {
  async index (req, res) {
    const { page = 1, orderBy = 'id' } = req.query;
    const attributes = await isAdmin(req.userId) ? ['id', 'role', 'name', 'email', 'passwordResetExpires', 'passwordResetToken', 'createdAt', 'updatedAt']: ['id', 'name'];

    const options = {
      page,
      attributes,
      order: [[orderBy, 'ASC']],
      paginate: 10,
    };

    try {
      const users = await User.paginate(options);

      return res.status(200).json(users);
    } catch (err) {
      return res.status(500).json({
        error: 500,
        password: 'Error on list users.'
      });
    }
  },

  async show (req, res) {
    const { id } = req.params;

    try {
      const user = await User.findByPk(id);

      if (req.userId === id || await isAdmin(req.userId)) {
        user.password = undefined;
        return res.status(200).json({ user });
      }

      return res.status(200).json({ 'user': {
        id: user.id,
        name: user.name
      } });
    } catch (err) {
      return res.status(500).json({
        error: 500,
        password: 'Error on show user.'
      });
    }
  },

  async update (req, res) {
    const { id } = req.params;
    const { name, email } = req.body;

    if (req.userId === id || await isAdmin(req.userId)) {
      try {
        const user = await User.findByPk(id);

        user.name = name;
        user.email = email;

        await user.save();

        user.password = undefined;
        
        return res.status(200).json({ user });
      } catch (err) {
        return res.json(err.message);
        return res.status(500).json({
          error: 500,
          message: 'Error on update user.'
        });
      }
    }

    return res.status(403).json({
      error: 403,
      message: 'You not have access this resource.'
    });
  },

  async destroy (req, res) {
    const { id } = req.params;

    if (req.userId === id || await isAdmin(req.userId)) {
      try {
        const user = await User.destroy({ where: { id } });

        if (user)
          return res.status(204).end();

        return res.status(404).json({
          error: 404,
          message: 'User not found.'
        });
      } catch (err) {
        return res.status(500).json({
          error: 500,
          message: 'Error on remove user.'
        });
      }
    }

    return res.status(403).json({
      error: 403,
      message: 'You not have access this resource.'
    });
  },

  async disableUser (req, res) {
    const { id } = req.params;
    const { status } = req.query;

    try {
      const user = await User.findByPk(id);

      user.role = status ? 'disabled': 'user';

      await user.save();

      user.password = undefined;

      return res.status(200).json({ user });
    } catch (err) {
      return res.status(500).json({
        error: 500,
        message: 'Error on disable user.'
      });
    }
  },

  async auth (req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if ( ! user) {
        return res.status(400).json({
          error: 404,
          password: 'User not exists.'
        });
      }

      if ( ! await user.validatePassword(password)) {
        return res.status(401).json({
          error: 401,
          message: 'Password is incorrect.'
        });
      }

      user.password = undefined;

      const token = generateToken({ id: user.id });

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
      if (await User.findOne({ where: { email } })) {
        return res.status(409).json({
          error: 409,
          message: 'User already exists.'
        });
      }

      const { name, password } = req.body;
      const role = (req.role && req.role === 'admin') ? 'admin': 'user';
      
      const user = await User.create({
        name,
        email,
        password,
        role
      });

      user.password = undefined;
      
      const token = generateToken({ id: user.id });

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
      const user = await User.findOne({ where: { email } });

      if ( ! user) {
        return res.status(404).json({
          error: 404,
          message: 'User not found.'
        });
      }

      const token = crypto.randomBytes(20).toString('hex');

      const now = new Date();
      now.setHours(now.getHours() + 1);

      user.passwordResetToken = token;
      user.passwordResetExpires = now;

      await user.save();

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
      const user = await User.findOne({ where: { email } });

      if ( ! user) {
        return res.status(404).json({
          error: 404,
          message: 'User not found.'
        });
      }

      const revokedToken = await RevokedTokens.findOne({ where: {
        user_id: user.id,
        token: token
      } });

      if (revokedToken) {
        return res.status(401).json({
          error: 401,
          message: 'The token has already been used.'
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
          message: 'Token expired. Generate a new token.'
        });
      }

      user.password = password;

      await user.save();

      await RevokedTokens.create({
        user_id: user.id,
        token
      });

      return res.status(204).end();
    } catch (err) {
      return res.status(500).json({
        error: 500,
        message: 'Cannot reset password, try again.'
      });
    }
  }
}

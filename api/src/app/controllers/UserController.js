import { isAdmin } from './helpers';

import User from '../models/User';

export class UserController {
  static async index (req, res) {
    const { page = 1, orderBy = 'id' } = req.query;
    const attributes = await isAdmin(req.userId) ? [
      'id',
      'role',
      'name',
      'email',
      'passwordResetExpires',
      'passwordResetToken',
      'createdAt',
      'updatedAt'
    ]: ['id', 'name'];

    const options = {
      page,
      paginate: 10,
      attributes,
      order: [[orderBy, 'ASC']],
    };

    try {
      const users = await User.paginate(options);

      return res.status(200).json(users);
    } catch {
      return res.status(500).json({
        error: 500,
        password: 'Error on list users.'
      });
    }
  }

  static async show (req, res) {
    const { id } = req.params;

    try {
      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({
          error: 404,
          message: 'Not found user.'
        });
      }

      if (req.userId === id || await isAdmin(req.userId)) {
        user.password = undefined;
        return res.status(200).json({ user });
      }

      return res.status(200).json({
        'user': {
          id: user.id,
          name: user.name
        }
      });
    } catch {
      return res.status(500).json({
        error: 500,
        password: 'Error on show user.'
      });
    }
  }
  
  static async update (req, res) {
    const { userId } = req;
    const { id } = req.params;
    const { name, email } = req.body;

    if (userId === id || await isAdmin(userId)) {
      try {
        const user = await User.findByPk(id);

        if (!user) {
          return res.status(404).json({
            error: 404,
            message: 'Not found user.'
          });
        }

        user.name = name;
        user.email = email;

        await user.save();

        user.password = undefined;
        
        return res.status(200).json({ user });
      } catch {
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
  }
  
  static async destroy (req, res) {
    const { userId } = req;
    const { id } = req.params;

    if (userId === id || await isAdmin(userId)) {
      try {
        const user = await User.destroy({
          where: { id }
        });

        if (user)
          return res.status(204).end();

        return res.status(404).json({
          error: 404,
          message: 'User not found.'
        });
      } catch {
        return res.status(500).json({
          error: 500,
          message: 'Error on destroy user.'
        });
      }
    }

    return res.status(403).json({
      error: 403,
      message: 'You not have access this resource.'
    });
  }
}

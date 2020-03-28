import { Op } from 'sequelize';

import User from '../../models/User';
import Category from '../../models/Category';

export async function isAdmin (id) {
  const user = await User.findOne({ where: {
    id, role: 'admin'
  } });

  if (user)
    return user.role === 'admin';

  return false;
}

export async function findOrCreateCategory(category) {
  const [ model ] = await Category.findOrCreate({
    where: {
      title: {
        [Op.iLike]: `%${category}%`
      }
    },
    defaults: {
      title: category,
      description: 'no description.',
    }
  });

  return model;
}

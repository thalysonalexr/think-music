import jwt from 'jsonwebtoken';

import User from '../models/User';

export const isAdmin = async (id) => {
  const user = await User.findOne({ where: {
    id, role: 'admin'
  } });

  if (user)
    return user.role === 'admin';

  return false;
}

export const generateToken = (params = {}) => {
  return jwt.sign(params, process.env.TM_SECRET, {
    expiresIn: 86400
  });
}

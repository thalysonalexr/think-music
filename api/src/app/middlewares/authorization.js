import User from '../models/User';

const authorizationMiddleware = async (req, res, next) => {
  const user = await User.findOne({ where: {
    id: req.userId,
    role: 'admin'
  } });

  if (user && user.role === 'admin') {
    req.role = 'admin';
    return next();
  }

  return res.status(403).json({
    error: 403,
    message: 'Forbidden the access to resource.'
  });
}

export default authorizationMiddleware;

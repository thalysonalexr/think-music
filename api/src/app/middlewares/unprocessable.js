import User from '../models/User';

const unprocessableMiddleware = async (req, res, next) => {
  const user = await User.findByPk(req.userId);

  if (user && user.status)
    return next();

  return res.status(422).json({
    error: 422,
    message: 'This user are inactive or latest removed.'
  });
}

export default unprocessableMiddleware;

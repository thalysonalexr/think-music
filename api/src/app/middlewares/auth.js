import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if ( ! authHeader) {
    return res.status(401).json({
      error: 401,
      message: 'No token provided.'
    });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({
      error: 401,
      message: 'Error token.'
    });
  }

  const [ scheme, token ] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({
      error: 401,
      message: 'Token malformatted.'
    });
  }

  jwt.verify(token, process.env.TM_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        error: 401,
        message: 'Token invalid.'
      });
    }

    req.userId = decoded.id;
    return next();
  });
};

export default authMiddleware;

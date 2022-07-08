const jwt = require('jsonwebtoken');
const ErrorHandler = require('../errors/error');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new ErrorHandler(401, 'Unauthroized'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    next(new ErrorHandler(401, 'Unauthorized'));
  }
  req.user = payload;
  return next();
};

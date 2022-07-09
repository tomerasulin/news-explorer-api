const jwt = require('jsonwebtoken');
const ErrorHandler = require('../errors/error');

const { NODE_ENV, JWT_SECRET } = process.env;
const { UNAUTHORIZED, UNAUTHORIZED_ERR } = require('../utils/constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new ErrorHandler(UNAUTHORIZED, UNAUTHORIZED_ERR));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    next(new ErrorHandler(UNAUTHORIZED, UNAUTHORIZED_ERR));
  }
  req.user = payload;
  return next();
};

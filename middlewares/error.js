const { INTERNAL_SERVER, INTERNAL_SERVER_ERR } = require('../utils/constants');

module.exports = (err, req, res, next) => {
  const { statusCode = INTERNAL_SERVER, message } = err;
  res.status(statusCode).send({
    message: statusCode === INTERNAL_SERVER ? INTERNAL_SERVER_ERR : message,
  });
};

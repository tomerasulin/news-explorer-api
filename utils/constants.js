// HTML statuses
const HTTP_OK = 200;
const CREATED = 201;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const NOT_FOUND = 404;
const CONFLICT = 409;
const MONGO = 11000;
const INTERNAL_SERVER = 500;

// Error messages
const UNAUTHORIZED_ERR = 'Unauthorized';
const INVALID_INPUT_ERR = 'Invalid input';
const NOT_FOUND_ERR = 'Not Found';
const CAST_ERR = 'CastError';
const DOCUMENT_NOT_FOUND_ERR = 'DocumentNotFoundError';
const FORBIDDEN_ERR = 'Forbidden';
const VALIDATION_ERR = 'ValidationError';
const INTERNAL_SERVER_ERR = 'An error occurred on the server';

module.exports = {
  HTTP_OK,
  CREATED,
  UNAUTHORIZED,
  FORBIDDEN,
  BAD_REQUEST,
  UNAUTHORIZED_ERR,
  INVALID_INPUT_ERR,
  NOT_FOUND_ERR,
  CAST_ERR,
  DOCUMENT_NOT_FOUND_ERR,
  FORBIDDEN_ERR,
  NOT_FOUND,
  VALIDATION_ERR,
  MONGO,
  CONFLICT,
  INTERNAL_SERVER,
  INTERNAL_SERVER_ERR,
};

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ErrorHandler = require('../errors/error');

const { NODE_ENV, JWT_SECRET } = process.env;
const {
  HTTP_OK,
  CREATED,
  NOT_FOUND,
  BAD_REQUEST,
  NOT_FOUND_ERR,
  CAST_ERR,
  INVALID_INPUT_ERR,
  VALIDATION_ERR,
  MONGO,
  CONFLICT,
} = require('../utils/constants');

// GET /users/me
// returns information about the logged-in user (email and name)
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new ErrorHandler(NOT_FOUND, NOT_FOUND_ERR);
      }
      return res.status(HTTP_OK).send({
        name: user.name,
        email: user.email,
        _id: user._id.toString(),
      });
    })
    .catch((err) => {
      if (err.name === CAST_ERR) {
        next(new ErrorHandler(BAD_REQUEST, INVALID_INPUT_ERR));
      } else {
        next(err);
      }
    });
};

// POST /signin
// Checks the email and password passed in the body
// and returns a JWT
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};

// POST /signup
// Creates a user with the passed
// email, password, and name in the body
const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash }))
    .then((user) => res.status(CREATED).send({ name, email, _id: user._id }))
    .catch((err) => {
      if (err.name === VALIDATION_ERR) {
        next(new ErrorHandler(BAD_REQUEST, INVALID_INPUT_ERR));
      } else if (err.code === MONGO) {
        next(new ErrorHandler(CONFLICT, 'User already exists'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCurrentUser,
  login,
  createUser,
};

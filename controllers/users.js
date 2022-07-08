const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ErrorHandler = require('../errors/error');

const { NODE_ENV, JWT_SECRET } = process.env;

// HTML statuses
const HTTP_OK = 200;
const CREATED = 201;

// GET /users/me
// returns information about the logged-in user (email and name)
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new ErrorHandler(404, 'Not Found');
      }
      return res.status(HTTP_OK).send({
        name: user.name,
        email: user.email,
        _id: user._id.toString(),
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorHandler(400, 'Invalid Input'));
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
    .then((user) => res.status(CREATED).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorHandler(400, 'Invalid Input'));
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

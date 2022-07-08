const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getCurrentUser } = require('../controllers/users');

// GET /users/me
router.get(
  '/me',
  celebrate({
    headers: Joi.object().keys({}).unknown(true),
  }),
  getCurrentUser,
);

module.exports = router;

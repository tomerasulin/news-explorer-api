const router = require('express').Router();
const articleRoutes = require('./articles');
const userRoutes = require('./users');

const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');

router.post('/signin', login);
router.post('/signup', createUser);
router.use(auth);
router.use(userRoutes, articleRoutes);

module.exports = router;

const router = require('express').Router();
const { validateReg, validateAuth } = require('../middlewares/reqValidation');
const { auth } = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const { usersRouter } = require('./users');
const { articlesRouter } = require('./articles');

router.post('/signup', validateReg, createUser); // создание юзера
router.post('/signin', validateAuth, login); // логин

router.use(auth); // авторизация

router.use('/users', usersRouter); // роуты юзера
router.use('/articles', articlesRouter); // роуты статей

module.exports = {
  router,
};

const usersRouter = require('express').Router();
const { getUserById } = require('../controllers/users');

usersRouter.get('/me', getUserById);

module.exports = {
  usersRouter,
};

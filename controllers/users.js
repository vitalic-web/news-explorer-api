const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');
const { DEV_SECRET } = require('../utils/config');
const {
  invalidDataText,
  successRegistrationText,
  sameEmailExistsText,
  errorMailOrPasswordText,
  notFoundTokenText,
  notFoundUserText,
} = require('../utils/constants');

// регистрация юзера
const createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  return User.findOne({ email })
    .then((user) => {
      if (user) return next(new ConflictError(sameEmailExistsText));

      return bcrypt.hash(password, 10)
        .then((hash) => {
          User.create({
            email, password: hash, name,
          })
            .then(() => res.send({ message: successRegistrationText(email) }))
            .catch((err) => {
              if (err.name === 'ValidationError') {
                next(new BadRequestError(invalidDataText));
              }
              next(err);
            });
        });
    })
    .catch(next);
};

// аутентификация пользователя
const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password') // находим юзера по емейл
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError(errorMailOrPasswordText);
      }
      return bcrypt.compare(password, user.password) // проверяем совпадение паролей
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError(errorMailOrPasswordText);
          }
          return user; // если пароли совпали возвращаем данные юзера
        });
    })
    .then((loggedUser) => {
      const token = jwt.sign(
        { _id: loggedUser._id },
        NODE_ENV === 'production' ? JWT_SECRET : DEV_SECRET,
        { expiresIn: '7d' },
      ); // создаем токен сроком на 7 дней
      if (!token) {
        throw new UnauthorizedError(notFoundTokenText);
      }
      return res.status(200).send({ token });
    })
    .catch(next);
};

// поиск юзера по id
const getUserById = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError(notFoundUserText))
    .then((user) => res.send({
      email: user.email,
      name: user.name,
    }))
    .catch(next);
};

module.exports = {
  createUser,
  login,
  getUserById,
};

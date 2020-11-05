const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { unauthorizedText } = require('../utils/constants');
const { DEV_SECRET } = require('../utils/config');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) { // проверяем получили ли данные в нужном виде
    throw new UnauthorizedError(unauthorizedText);
  }

  const token = authorization.replace('Bearer ', ''); // извлекаем токен без слова Bearer

  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : DEV_SECRET,
    ); // попытаемся верифицировать токен
  } catch (err) {
    throw new UnauthorizedError(unauthorizedText); // отправим ошибку, если не получилось
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};

module.exports = { auth };

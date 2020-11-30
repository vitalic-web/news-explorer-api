const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const { PORT = 3000, NODE_ENV, DB_CONNECT_PROD } = process.env;
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/errorHandler');
const { limiter } = require('./middlewares/limiter');
const NotFoundError = require('./errors/NotFoundError');
const { notFoundText } = require('./utils/constants');
const { DB_CONNECT } = require('./utils/config');

const { router } = require('./routes/index');

mongoose.connect(NODE_ENV === 'production' ? DB_CONNECT_PROD : DB_CONNECT, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// создание лимита на запросы
// app.use(limiter);

// разрешить запросы с хоста (реакт)
app.use(cors({
  // origin: 'https://vtl-news.ru',
  origin: 'http://localhost:3000',
}));

app.use(helmet({
  contentSecurityPolicy: false, // нужен параметр, т.к. блокирует загрузку статей
}));

app.use(express.json()); // метод для парсинга req.body

// логгер запросов
app.use(requestLogger);

// все роуты
app.use(router);

// обработка несуществующего адреса
app.use('*', () => {
  throw new NotFoundError(notFoundText);
});

// логгер ошибок
app.use(errorLogger);

// обработчик ошибок валидации данных перед отправкой
app.use(errors());

// централизованная обработка ошибок
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

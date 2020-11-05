const { celebrate, Joi, CelebrateError } = require('celebrate');
const isURL = require('validator/lib/isURL');

const validateReg = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required(),
  }),
});

const validateAuth = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateCreateArticle = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().custom((value) => {
      if (!isURL(value)) {
        throw new CelebrateError();
      }
      return value;
    }),
    image: Joi.string().required().custom((value) => {
      if (!isURL(value)) {
        throw new CelebrateError();
      }
      return value;
    }),
  }),
});

const validateArticleId = celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().hex().min(24).max(24),
  }),
});

module.exports = {
  validateReg,
  validateAuth,
  validateCreateArticle,
  validateArticleId,
};

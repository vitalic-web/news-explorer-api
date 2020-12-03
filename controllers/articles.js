const Article = require('../models/articles');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const {
  invalidDataText, notFoundArticleText, notFoundArticlesText, notYourArticleText,
} = require('../utils/constants');

// выгрузка всех сохраненных статей юзера
const getArticlesByOwner = (req, res, next) => {
  Article.find({ owner: req.user._id }).select('+owner').sort({ createdAt: -1 })
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError(notFoundArticlesText);
      }

      res.send({ data: cards });
    })
    .catch(next);
};

// создание статьи
const createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  const owner = req.user._id;

  Article.create({
    keyword, title, text, date, source, link, image, owner,
  })
    .then((article) => {
      if (!article) {
        throw new BadRequestError(invalidDataText);
      }
      res.send({ data: article });
    })
    .catch(next);
};

// удаление карточки по id
const deleteArticleById = (req, res, next) => {
  Article.findById(req.params.articleId).select('+owner')
    .orFail(new NotFoundError(notFoundArticleText))
    .then((article) => {
      if (article.owner.toString() !== req.user._id.toString()) {
        throw new ForbiddenError(notYourArticleText);
      }
      return Article.deleteOne(article)
        .then((result) => res.send({ data: result }))
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  getArticlesByOwner,
  createArticle,
  deleteArticleById,
};

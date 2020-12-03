const articlesRouter = require('express').Router();
const { getArticlesByOwner, createArticle, deleteArticleById } = require('../controllers/articles');
const { validateCreateArticle, validateArticleId } = require('../middlewares/reqValidation');

articlesRouter.get('/', getArticlesByOwner);
articlesRouter.post('/', validateCreateArticle, createArticle);
articlesRouter.delete('/:articleId', validateArticleId, deleteArticleById);

module.exports = {
  articlesRouter,
};

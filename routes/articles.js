const articlesRouter = require('express').Router();
const { getAllArticles, createArticle, deleteArticleById } = require('../controllers/articles');
const { validateCreateArticle, validateArticleId } = require('../middlewares/reqValidation');

articlesRouter.get('/', getAllArticles);
articlesRouter.post('/', validateCreateArticle, createArticle);
articlesRouter.delete('/:articleId', validateArticleId, deleteArticleById);

module.exports = {
  articlesRouter,
};

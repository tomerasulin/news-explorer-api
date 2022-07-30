const Article = require('../models/article');
const ErrorHandler = require('../errors/error');
const {
  HTTP_OK,
  CREATED,
  BAD_REQUEST,
  FORBIDDEN,
  INVALID_INPUT_ERR,
  NOT_FOUND_ERR,
  CAST_ERR,
  DOCUMENT_NOT_FOUND_ERR,
  FORBIDDEN_ERR,
  NOT_FOUND,
} = require('../utils/constants');

// GET /articles
// returns all articles saved by the user
const getAllArticles = (req, res, next) => {
  Article.find({})
    .populate('owner')
    .then((articles) => {
      res.status(HTTP_OK).send(articles);
    })
    .catch(next);
};

// POST /articles
// creates an article with the passed
// keyword, title, text, date, source, link, and image in the body
const createArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;
  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: req.user._id,
  })
    .then((article) => {
      Article.populate(article, { path: 'owner' }).then(() =>
        res.status(CREATED).send(article)
      );
    })
    .catch(next);
};

// DELETE /articles/articleId
// deletes the stored article by _id
const deleteArticle = (req, res, next) => {
  Article.findByIdAndDelete(req.params.articleId)
    .orFail()
    .then(() => {
      res.status(HTTP_OK).send({ message: 'Article has been deleted' });
    })
    .catch((err) => {
      if (err.name === CAST_ERR) {
        next(new ErrorHandler(BAD_REQUEST, INVALID_INPUT_ERR));
      } else if (err.name === DOCUMENT_NOT_FOUND_ERR) {
        next(new ErrorHandler(NOT_FOUND, NOT_FOUND_ERR));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getAllArticles,
  createArticle,
  deleteArticle,
};

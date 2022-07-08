const Article = require('../models/article');
const ErrorHandler = require('../errors/error');

// HTML statuses
const HTTP_OK = 200;
const CREATED = 201;

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
  const
    {
      keyword, title, text, date, source, link, image,
    } = req.body;
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
      Article.populate(article, { path: 'owner' }).then(() => res.status(CREATED).send(article));
    })
    .catch(next);
};

// DELETE /articles/articleId
// deletes the stored article by _id
const deleteArticle = (req, res, next) => {
  Article.findById(req.params.articleId)
    .orFail()
    .then((article) => {
      if (article.owner._id.toString() !== req.user._id) {
        throw new ErrorHandler(403, 'Unauthorized');
      }
      return Article.findByIdAndDelete(req.params.articleId).then(() => res.status(HTTP_OK).send({ message: 'Article has been deleted' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorHandler(400, 'Invalid Input'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new ErrorHandler(404, 'Not Found'));
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

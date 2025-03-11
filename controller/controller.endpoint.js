const endpoints = require("../endpoints.json");
const {
  selectTopics,
  selectArticleById,
  selectArticles,
  selectCommnentsByArticleid,
} = require("../model/model.enpoint.js");

exports.getApi = (req, res) => {
  res.status(200).send({ endpoints });
};

exports.getTopics = (req, res) => {
  return selectTopics().then((article) => {
    res.status(200).send({ article });
  });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  return selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getArticles = (req, res, next) => {
  return selectArticles()
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  return selectCommnentsByArticleid(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((error) => {
      next(error);
    });
};

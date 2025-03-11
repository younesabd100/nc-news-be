const { checkArticleIdExist } = require("../db/seeds/utils.js");
const endpoints = require("../endpoints.json");
const {
  selectTopics,
  selectArticleById,
  selectArticles,
  selectCommnentsByArticleid,
  insertCommentsByArticleId,
  updateArticleByArticleId,
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
  const promises = [selectCommnentsByArticleid(article_id)];
  if (article_id) {
    promises.push(checkArticleIdExist(article_id));
  }
  Promise.all(promises)
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((error) => {
      next(error);
    });
};
exports.postCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  insertCommentsByArticleId(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((error) => {
      next(error);
    });
};

const {
  checkArticleIdExist,
  checkColumnExist,
  checkTopicExist,
} = require("../db/seeds/utils.js");
const endpoints = require("../endpoints.json");
const {
  selectTopics,
  selectArticleById,
  selectArticles,
  selectCommnentsByArticleid,
  insertCommentsByArticleId,
  updateArticleByArticleId,
  removeCommentByCommentId,
  selectUsers,
  selectUsersById,
  updateCommentByCommentId,
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
  const { sort_by, order, topic } = req.query;
  const promises = [selectArticles(sort_by, order, topic)];

  if (sort_by && order) {
    promises.push(checkColumnExist(sort_by, "articles"));
  }
  if (topic) {
    promises.push(checkTopicExist(topic));
  }
  Promise.all(promises)
    .then(([article]) => {
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
exports.patchArticleByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  const promises = [updateArticleByArticleId(article_id, inc_votes)];
  if (article_id) {
    promises.push(checkArticleIdExist(article_id));
  }
  Promise.all(promises)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch((error) => {
      next(error);
    });
};
exports.deleteCommentByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentByCommentId(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((error) => {
      next(error);
    });
};
exports.getUsers = (req, res, next) => {
  return selectUsers()
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((error) => {
      next(error);
    });
};
exports.getUsersById = (req, res, next) => {
  const { username } = req.params;
  return selectUsersById(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((error) => {
      next(error);
    });
};
exports.patchCommentByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateCommentByCommentId(comment_id, inc_votes)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((error) => {
      next(error);
    });
};

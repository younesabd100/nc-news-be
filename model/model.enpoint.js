const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT slug, description FROM topics").then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "article not found",
        });
      }
      return rows[0];
    });
};

exports.selectArticles = () => {
  return db
    .query(
      `SELECT 
          articles.author,
          articles.title, 
          articles.article_id, 
          articles.topic, 
          articles.created_at, 
          articles.votes, 
          articles.article_img_url,  
          COUNT(comments.comment_id) AS comment_count
FROM articles
LEFT JOIN comments ON articles.article_id = comments.article_id
GROUP BY articles.article_id, 
          articles.author,
          articles.title, 
          articles.topic, 
          articles.created_at, 
          articles.votes, 
          articles.article_img_url
ORDER BY articles.created_at DESC`
    )
    .then(({ rows }) => {
      return rows;
    });
};
exports.selectCommnentsByArticleid = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "no comments or incorect article_id",
        });
      }

      return rows;
    });
};

const db = require("../db/connection");
const format = require("pg-format");

exports.selectTopics = () => {
  return db.query("SELECT slug, description FROM topics").then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleById = (article_id) => {
  let queryString = `SELECT 
      articles.article_id,
      articles.title,
      articles.body,
      articles.votes,
      articles.topic,
      articles.author,
      articles.created_at,
      articles.article_img_url,
  CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
  GROUP BY articles.article_id`;

  return db.query(queryString, [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "article not found",
      });
    }
    return rows[0];
  });
};
exports.selectArticles = (sort_by = "created_at", order = "DESC", topic) => {
  const validOrders = ["ASC", "DESC"];
  if (!validOrders.includes(order.toUpperCase())) {
    order = "DESC";
  }
  let queryString = `SELECT 
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
          ORDER BY %I %s`;
  if (topic) {
    queryString = `SELECT 
          articles.author,
          articles.title, 
          articles.article_id, 
          articles.topic, 
          articles.created_at, 
          articles.votes, 
          articles.article_img_url,  
          CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count
FROM articles
LEFT JOIN comments ON articles.article_id = comments.article_id
WHERE topic = $1
GROUP BY articles.article_id, 
          articles.author,
          articles.title, 
          articles.topic, 
          articles.created_at, 
          articles.votes, 
          articles.article_img_url
          ORDER BY %I %s`;
    const queryFormat = format(queryString, sort_by, order);
    return db.query(queryFormat, [topic]).then(({ rows }) => {
      return rows;
    });
  } else {
    const queryFormat = format(queryString, sort_by, order);
    return db.query(queryFormat).then(({ rows }) => {
      return rows;
    });
  }
};
exports.selectCommnentsByArticleid = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};
exports.insertCommentsByArticleId = (article_id, username, body) => {
  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "Missing info" });
  }
  if (typeof username !== "string" || typeof body !== "string") {
    return Promise.reject({
      status: 400,
      msg: "Invalid data type entered",
    });
  }
  return db
    .query(
      `INSERT INTO comments (article_id, author, body) VALUES($1,$2,$3) RETURNING*`,
      [article_id, username, body]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
exports.updateArticleByArticleId = (article_id, inc_votes) => {
  if (!inc_votes) {
    return Promise.reject({ status: 400, msg: "Missing info" });
  }
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING * `,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
exports.removeCommentByCommentId = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING * `, [
      comment_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      }
      return rows[0];
    });
};
exports.selectUsers = () => {
  return db.query(`SELECT * FROM users `).then(({ rows }) => {
    return rows;
  });
};

exports.selectUsersById = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1 `, [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "User not found",
        });
      }
      return rows[0];
    });
};
exports.updateCommentByCommentId = (comment_id, inc_votes) => {
  if (!inc_votes) {
    return Promise.reject({ status: 400, msg: "Missing info" });
  }
  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING * `,
      [inc_votes, comment_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 400,
          msg: "comment_id not found",
        });
      }
      return rows[0];
    });
};

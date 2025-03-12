const db = require("../../db/connection");
const format = require("pg-format");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createLookup = (array, key, value) => {
  return array.reduce((lookup, item) => {
    if (item[key] && item[value]) {
      lookup[item[key]] = item[value];
    }
    return lookup;
  }, {});
};

exports.checkArticleIdExist = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id =$1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
      return rows[0];
    });
};
exports.checkColumnExist = (column, table) => {
  const queryString = format(`SELECT %I FROM %I LIMIT 1`, column, table);
  return db.query(queryString).then((rows) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "column not found " });
    }
    return rows[0];
  });
};
exports.checkTopicExist = (topic) => {
  return db
    .query(`SELECT * FROM articles WHERE topic = $1`, [topic])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "topic not found " });
      }

      return rows[0];
    });
};

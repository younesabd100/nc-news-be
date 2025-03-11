const db = require("../../db/connection");

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
    });
};

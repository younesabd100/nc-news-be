const db = require("../connection");
const format = require("pg-format");
const { createLookup, convertTimestampToDate } = require("./utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
  let topicLookup, authorLookup, articleLookup;

  return db
    .query("DROP TABLE IF EXISTS comments;")
    .then(() => {
      return db.query("DROP TABLE IF EXISTS articles;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS users;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS topics;");
    })
    .then(() => {
      return createTopics(topicData);
    })
    .then((topics) => {
      topicLookup = topics;
      return createUsers(userData);
    })
    .then((users) => {
      authorLookup = users;
      return createArticles(articleData, topicLookup, authorLookup);
    })
    .then((articles) => {
      articleLookup = articles;
      return createComments(commentData, articleLookup, authorLookup);
    })
    .catch((err) => {
      console.error("Error during seeding:", err);
    });
};

function createTopics(topicData) {
  return db
    .query(
      `CREATE TABLE topics
      (slug VARCHAR(225) PRIMARY KEY,
      description VARCHAR(225) NOT NULL,
      img_url VARCHAR(1000) NOT NULL)`
    )
    .then(() => {
      const formattedTopics = topicData.map((topic) => {
        return [topic.slug, topic.description, topic.img_url];
      });

      const topicsString = format(
        `INSERT INTO topics (slug, description, img_url) VALUES %L RETURNING *`,
        formattedTopics
      );
      return db.query(topicsString).then(({ rows }) => {
        const topicLookup = createLookup(rows, "slug", "slug");
        return topicLookup;
      });
    });
}

function createUsers(userData) {
  return db
    .query(
      `CREATE TABLE users
      (username VARCHAR(225) PRIMARY KEY,
      name VARCHAR(225) NOT NULL,
      avatar_url VARCHAR(1000) NOT NULL)`
    )
    .then(() => {
      const formattedUsers = userData.map((user) => {
        return [user.username, user.name, user.avatar_url];
      });

      const usersString = format(
        `INSERT INTO users (username, name, avatar_url) VALUES %L RETURNING *`,
        formattedUsers
      );
      return db.query(usersString).then(({ rows }) => {
        const authorLookup = createLookup(rows, "username", "username");
        return authorLookup;
      });
    });
}

function createArticles(articleData, topicLookup, authorLookup) {
  return db
    .query(
      `CREATE TABLE articles
      (article_id SERIAL PRIMARY KEY NOT NULL,
      title VARCHAR(225) NOT NULL,
      topic VARCHAR(225) REFERENCES topics(slug) ON DELETE CASCADE,
      author VARCHAR(225) REFERENCES users(username) ON DELETE CASCADE,
      body TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      votes INT DEFAULT 0,
      article_img_url VARCHAR(1000))`
    )
    .then(() => {
      const formattedArticles = articleData.map((article) => {
        const formattedArticle = convertTimestampToDate(article);
        return [
          formattedArticle.title,
          topicLookup[formattedArticle.topic],
          authorLookup[formattedArticle.author],
          formattedArticle.body,
          formattedArticle.created_at,
          formattedArticle.votes,
          formattedArticle.article_img_url,
        ];
      });

      const articleString = format(
        `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *`,
        formattedArticles
      );
      return db.query(articleString).then(({ rows }) => {
        const articleLookup = createLookup(rows, "title", "article_id");

        return articleLookup;
      });
    });
}

function createComments(commentData, articleLookup, authorLookup) {
  return db
    .query(
      `CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        article_id INT REFERENCES articles(article_id) ON DELETE CASCADE,
        body TEXT NOT NULL,
        votes INT DEFAULT 0,
        author VARCHAR(225) REFERENCES users(username) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)`
    )
    .then(() => {
      const formattedComments = commentData.map((comment) => {
        const formattedComment = convertTimestampToDate(comment);
        return [
          articleLookup[formattedComment.article_title],
          formattedComment.body,
          formattedComment.votes,
          authorLookup[formattedComment.author],
          formattedComment.created_at,
        ];
      });
      const commentsString = format(
        `INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L RETURNING *`,
        formattedComments
      );
      return db.query(commentsString).then(({ rows }) => {
        return rows;
      });
    });
}

module.exports = seed;

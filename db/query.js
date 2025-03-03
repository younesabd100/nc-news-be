const devData = require("../db/data/development-data/index.js");
const seed = require("../db/seeds/seed.js");
const db = require("../db/connection.js");

// Get all the users
function getAllUsers() {
  return db
    .query(`SELECT * FROM users;`)
    .then(({ rows }) => {
      console.log(rows);
    })
    .catch((err) => {
      console.error("Error fetching users:", err);
    })
    .finally(() => {
      db.end(); // Close DB connection after the query is complete
    });
}

// getAllUsers();

//Get all of the articles where the topic is coding
function getArticlesCoding() {
  return db
    .query(`SELECT * FROM articles WHERE topic = 'coding' ;`)
    .then(({ rows }) => {
      console.log(rows);
    })
    .catch((err) => {
      console.error("Error fetching users:", err);
    })
    .finally(() => {
      db.end(); // Close DB connection after the query is complete
    });
}

// getArticlesCoding();

// Get all of the comments where the votes are less than zero

function getCommentsVote0() {
  return db
    .query(`SELECT * FROM comments WHERE votes < 0;`)
    .then(({ rows }) => {
      console.log(rows);
    })
    .catch((err) => {
      console.error("Error fetching users:", err);
    })
    .finally(() => {
      db.end(); // Close DB connection after the query is complete
    });
}
// getCommentsVote0();

//Get all of the topics
function getTopics() {
  return db
    .query(`SELECT * FROM topics;`)
    .then(({ rows }) => {
      console.log(rows);
    })
    .catch((err) => {
      console.error("Error fetching users:", err);
    })
    .finally(() => {
      db.end(); // Close DB connection after the query is complete
    });
}
// getTopics();

//Get all of the articles by user grumpy19

function getArticlesGrunpy19() {
  return db
    .query(`SELECT * FROM articles WHERE ;`)
    .then(({ rows }) => {
      console.log(rows);
    })
    .catch((err) => {
      console.error("Error fetching users:", err);
    })
    .finally(() => {
      db.end(); // Close DB connection after the query is complete
    });
}

const express = require("express");
const app = express();
const {
  getApi,
  getTopics,
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postCommentsByArticleId,
  patchArticleByArticleId,
} = require("./controller/controller.endpoint");
const {
  handlePsqlError,
  handleServerError,
} = require("./controller/errorHandler");

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentsByArticleId);

app.use(handlePsqlError);
app.use(handleServerError);

module.exports = app;

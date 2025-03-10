const express = require("express");
const app = express();
const {
  getApi,
  getTopics,
  getArticleById,
} = require("./controller/controller.endpoint");
const {
  handlePsqlError,
  handleServerError,
} = require("./controller/errorHandler");

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.use(handlePsqlError);
app.use(handleServerError);

module.exports = app;

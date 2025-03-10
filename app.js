const express = require("express");
const app = express();
const { getApi, getTopics } = require("./controller/controller.endpoint");
const {
  handlePsqlError,
  handleServerError,
} = require("./controller/errorHandler");

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.use(handlePsqlError);
app.use(handleServerError);

module.exports = app;

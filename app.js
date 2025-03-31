const express = require("express");
const app = express();
const cors = require("cors");

const {
  handlePsqlError,
  handleServerError,
  handleCustomErrors,
} = require("./controller/errorHandler");
const apiRouter = require("./router/api.router");

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use(handleCustomErrors);
app.use(handlePsqlError);
app.use(handleServerError);

module.exports = app;

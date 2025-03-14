const { getTopics } = require("../controller/controller.endpoint");

const topicsRouter = require("express").Router();

topicsRouter.get("/", getTopics);

module.exports = topicsRouter;

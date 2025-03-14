const { getUsers } = require("../controller/controller.endpoint");

const usersRouter = require("express").Router();

usersRouter.get("/", getUsers);

module.exports = usersRouter;

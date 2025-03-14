const { getUsers, getUsersById } = require("../controller/controller.endpoint");

const usersRouter = require("express").Router();

usersRouter.get("/", getUsers);

usersRouter.get("/:username", getUsersById);

module.exports = usersRouter;

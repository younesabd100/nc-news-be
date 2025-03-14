const {
  deleteCommentByCommentId,
} = require("../controller/controller.endpoint");

const commentsRouter = require("express").Router();

commentsRouter.delete("/:comment_id", deleteCommentByCommentId);

module.exports = commentsRouter;

const {
  deleteCommentByCommentId,
  patchCommentByCommentId,
} = require("../controller/controller.endpoint");

const commentsRouter = require("express").Router();

commentsRouter
  .route("/:comment_id")
  .delete(deleteCommentByCommentId)
  .patch(patchCommentByCommentId);

module.exports = commentsRouter;

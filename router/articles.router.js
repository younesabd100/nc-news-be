const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentsByArticleId,
  patchArticleByArticleId,
} = require("../controller/controller.endpoint");

const articlesRouter = require("express").Router();

articlesRouter.get("/", getArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleByArticleId);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentsByArticleId);

module.exports = articlesRouter;

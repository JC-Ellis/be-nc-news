const articlesRouter = require("express").Router();
const {
  getArticleById,
  getAllArticles,
  patchArticleVotes,
  postNewArticle,
  deleteArticleById,
} = require("../controllers/articles.controller");

const {
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("../controllers/comments.controller");

articlesRouter
.route("/")
.get(getAllArticles)
.post(postNewArticle);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleVotes)
  .delete(deleteArticleById)

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = articlesRouter;

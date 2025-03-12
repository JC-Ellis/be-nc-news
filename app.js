const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");
app.use(express.json());

const { getAllTopics } = require("./controllers/topics.controller");

const {
  getArticleById,
  getAllArticles,
  patchArticleVotes,
} = require("./controllers/articles.controller");

const {
  getCommentsByArticleId,
  postCommentByArticleId,
  deleteCommentByCommentId,
} = require("./controllers/comments.controller");

const { getAllUsers } = require("./controllers/users.controller");

const {
  handleServerErrors,
  handleCustomErrors,
  handlePsqlErrors,
  handlePostErrors,
} = require("./controllers/errors.controllers");

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints });
});

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch("/api/articles/:article_id", patchArticleVotes);

app.delete("/api/comments/:comment_id", deleteCommentByCommentId);

app.get("/api/users", getAllUsers);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handlePostErrors);

app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "path not found" });
});

app.use(handleServerErrors);
module.exports = app;

const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");

const { getAllTopics } = require("./controllers/topics.controller");

const { getArticleById } = require("./controllers/articles.controller");

const { handleServerErrors, handleCustomErrors, handlePsqlErrors } = require("./controllers/errors.controllers");

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints });
});

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleById);

app.use(handleCustomErrors);

app.use(handlePsqlErrors)

app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "path not found" });
});

app.use(handleServerErrors);
module.exports = app;

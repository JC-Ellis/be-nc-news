const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");

//require in controllers and error handlers

const { getAllTopics } = require("./controllers/topics.controller")

const { getArticleById } = require("./controllers/articles.controller");

const { handleServerErrors } = require("./controllers/errors.controllers");


//api endpoints

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints });
});

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleById)

//error handlers

app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "path not found" });
});

app.use(handleServerErrors); //final error check if a misc error happens that hasn't been caught
module.exports = app;

const apiRouter = require("express").Router();
const endpoints = require("../endpoints.json");
const usersRouter = require("./users-router");
const articlesRouter = require("./articles-router");
const topicsRouter = require("./topics-router")
const commentsRouter = require("./comments-router");

apiRouter.get("/", (req, res) => {
  res.status(200).send({ endpoints });
});

apiRouter.use("/users", usersRouter);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/comments", commentsRouter);

apiRouter.use("/topics", topicsRouter);

module.exports = apiRouter;

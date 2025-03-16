const express = require("express");
const app = express();
const apiRouter = require("./routers/api-router");
app.use(express.json());

const {
  handleServerErrors,
  handleCustomErrors,
  handlePsqlErrors,
  handlePostErrors,
  handleOffsetErrors,
} = require("./controllers/errors.controllers");

app.use("/api", apiRouter);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleOffsetErrors);
app.use(handlePostErrors);
app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "path not found" });
});
app.use(handleServerErrors);

module.exports = app;

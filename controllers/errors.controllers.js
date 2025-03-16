exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
};

exports.handleOffsetErrors = (err, req, res, next) => {
  if (err.code === "2201X") {
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
};

exports.handlePostErrors = (err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ msg: "article or username not found" });
  } else {
    next(err);
  }
};

exports.handleServerErrors = (err, req, res, next) => {
  console.log(err, "this is from handle server errors");
  res.status(500).send({ msg: "internal server error" });
};

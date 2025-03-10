exports.handleServerErrors = (err, req, res, next) => {
  console.log(err, "this is from handle server errors");
  res.status(500).send({ msg: "internal server error" });
};

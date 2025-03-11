const {
  fetchCommentsByArticleId,
  addCommentByArticleId,
} = require("../models/comments.models");

exports.getCommentsByArticleId = (req, res, next) => {
  const article_id = req.params.article_id;
  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByArticleId = (req, res, next) => {
  const article_id = req.params.article_id;
  const { username, body } = req.body;
  if (!body) {
    return res.status(400).send({ msg: "Missing required fields: comment" });
  }
  addCommentByArticleId(article_id, username, body).then((comment) => {
    res.status(201).send({ comment });
  })
  .catch((err) => {
    next(err);
  })
};

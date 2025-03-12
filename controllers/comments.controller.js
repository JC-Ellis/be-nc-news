const {
  fetchCommentsByArticleId,
  addCommentByArticleId,
  removeCommentByCommentId,
} = require("../models/comments.models");

const { checkArticleExists } = require("../models/articles.models");

exports.getCommentsByArticleId = (req, res, next) => {
  const article_id = req.params.article_id;
  const promises = [
    fetchCommentsByArticleId(article_id),
    checkArticleExists(article_id),
  ];
  Promise.all(promises)
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByArticleId = (req, res, next) => {
  const article_id = req.params.article_id;
  const { username, body } = req.body;
  addCommentByArticleId(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentByCommentId = (req, res, next) => {
    const comment_id = req.params.comment_id;
    removeCommentByCommentId(comment_id)
      .then(() => {
        res.status(204).send();
      })
      .catch((err) => {
        next(err);
      });
  };
  

const {
  fetchArticleById,
  fetchAllArticles,
  updateArticleVotes,
} = require("../models/articles.models");

exports.getAllArticles = (req, res, next) => {
  fetchAllArticles()
    .then((articles) => res.status(200).send({ articles }))
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const article_id = req.params.article_id;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleVotes = (req, res, next) => {
  const article_id = req.params.article_id;
  const {inc_votes} = req.body
  updateArticleVotes(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

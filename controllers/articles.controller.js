const {
  fetchArticleById,
  fetchAllArticles,
  updateArticleVotes,
  addNewArticle,
  removeArticleById,
} = require("../models/articles.models");
const { checkTopicExists } = require("../models/topics.models");

exports.getAllArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  const promises = [
    checkTopicExists(topic),
    fetchAllArticles(sort_by, order, topic),
  ];
  Promise.all(promises)
    .then(([_, articles]) => res.status(200).send({ articles }))
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
  const { inc_votes } = req.body;
  updateArticleVotes(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
exports.postNewArticle = (req, res, next) => {
  const { author, title, body, topic, article_img_url } = req.body;
  addNewArticle(author, title, body, topic, article_img_url)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
exports.deleteArticleById = (req, res, next) => {
  const article_id = req.params.article_id;
  removeArticleById(article_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
const db = require("../db/connection");

exports.fetchAllArticles = () => {
  return db
    .query(
      `SELECT a.article_id, a.title, a.author, a.topic, a.created_at, a.votes, a.article_img_url, 
      COUNT(c.comment_id) 
      AS comment_count 
      FROM articles a 
      LEFT JOIN comments c 
      ON a.article_id = c.article_id 
      GROUP BY a.article_id 
      ORDER BY a.created_at DESC`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return rows[0];
    });
};

exports.checkArticleExists = (article_id) => {
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
    });
};

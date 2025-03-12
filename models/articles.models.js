const { all } = require("../app");
const db = require("../db/connection");

exports.fetchAllArticles = (sortBy, orderBy) => {
  const allowedInputs = ["title", "author", "votes", "created_at", "asc", "desc"];
  let queryString = `
    SELECT a.article_id, a.title, a.author, a.topic, a.created_at, a.votes, a.article_img_url, 
      COUNT(c.comment_id) 
      AS comment_count 
      FROM articles a 
      LEFT JOIN comments c 
      ON a.article_id = c.article_id 
      GROUP BY a.article_id `;
  let binders = [];
  let order = [];

  if (sortBy) {
      binders.push(sortBy);
      queryString += `ORDER BY a.${binders} `;
    } else {queryString += `ORDER BY a.created_at `}
    if (orderBy) {
        order.push(orderBy)
        queryString += `${order}`
    } else {queryString += `DESC`}
    console.log(queryString)

    return db.query(queryString).then(({ rows }) => {
        return rows;
    });
};
// if (!allowedInputs.includes(sortBy)) {
//     return Promise.reject({ status: 404, msg: "invalid input" });
// }

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

exports.updateArticleVotes = (article_id, inc_votes) => {
  return db
    .query(`UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *`, [
      inc_votes,
      article_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
      return rows[0];
    });
};

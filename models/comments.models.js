const db = require("../db/connection");

exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return rows;
    });
};

exports.addCommentByArticleId = (article_id, username, body) => {
    return db
    .query(
        `INSERT INTO comments (article_id, body, votes, author, created_at)
        VALUES ($1, $2, 0, $3, NOW()) RETURNING *`, [article_id, body, username])
        .then(({ rows }) => {
            return rows[0]
        })
};

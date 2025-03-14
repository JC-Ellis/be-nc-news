const db = require("../db/connection");

exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.addCommentByArticleId = (article_id, username, body) => {
  if (!body || !username) {
    return Promise.reject({
      status: 400,
      msg: "Missing required fields: comment or username",
    });
  }
  return db
    .query(
      `INSERT INTO comments (article_id, body, votes, author, created_at)
        VALUES ($1, $2, 0, $3, NOW()) RETURNING *`,
      [article_id, body, username]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeCommentByCommentId = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      comment_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "comment not found" });
      }
    });
};
exports.updateCommentVotes = (comment_id, inc_votes) => {
  return db
    .query(`UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *`, [
      inc_votes,
      comment_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "comment not found" });
      }
      return rows[0];
    });
};

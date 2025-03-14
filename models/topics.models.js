const db = require("../db/connection");

exports.fetchAllTopics = () => {
  return db.query("SELECT slug, description FROM topics").then(({ rows }) => {
    return rows;
  });
};
exports.checkTopicExists = (topic_id) => {
  if (!topic_id) {
    return Promise.resolve();
  }
  return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [topic_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
    });
};
exports.addNewTopic = (slug, description) => {
  if (!slug || !description) {
    return Promise.reject({
      status: 400,
      msg: "Error: required field missing",
    });
  }
  return db
    .query(
      `INSERT INTO topics (slug, description)
  VALUES ($1, $2)
  RETURNING *`,
      [slug, description]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

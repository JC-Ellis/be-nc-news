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

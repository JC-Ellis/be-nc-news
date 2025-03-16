const db = require("../db/connection");

exports.fetchAllArticles = (
  sortBy = "created_at",
  orderBy = "DESC",
  topic,
  limit = 10,
  page = 1
) => {
  const allowedSortInputs = ["title", "author", "votes", "created_at"];
  const allowedOrderInputs = ["ASC", "DESC"];
  let queryString = `
  SELECT a.article_id, a.title, a.author, a.topic, a.created_at, a.votes, a.article_img_url, 
  COUNT(c.comment_id) 
  AS comment_count, 
  COUNT(a.article_id) OVER()
  AS total_count 
  FROM articles a 
  LEFT JOIN comments c 
  ON a.article_id = c.article_id `;

  let filterBy = [];
  filterBy.push(limit, page);

  if (topic) {
    filterBy.push(topic);
    queryString += `WHERE topic = $3 `;
  }

  if (
    !allowedSortInputs.includes(sortBy) ||
    !allowedOrderInputs.includes(orderBy.toUpperCase())
  ) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  queryString += `GROUP BY a.article_id ORDER BY a.${sortBy} ${orderBy.toUpperCase()} LIMIT $1 OFFSET $1 * ($2 -1)`;

  return db.query(queryString, filterBy).then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `
        SELECT a.*, 
        COUNT(c.comment_id) 
        AS comment_count 
        FROM articles a 
        LEFT JOIN comments c 
        ON a.article_id = c.article_id 
        WHERE a.article_id = $1
        GROUP BY a.article_id`,
      [article_id]
    )
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
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
      return rows[0];
    });
};
exports.addNewArticle = (
  author,
  title,
  body,
  topic,
  article_img_url = "no image added"
) => {
  if (!author || !title || !body || !topic) {
    return Promise.reject({
      status: 400,
      msg: "Error: required field missing",
    });
  }
  return db
    .query(
      `WITH inserted_article AS (
            INSERT INTO articles (author, title, body, topic, article_img_url)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *)
        SELECT a.*, 
            COUNT(c.comment_id) AS comment_count 
            FROM inserted_article a
            LEFT JOIN comments c 
            ON a.article_id = c.article_id
            GROUP BY a.title, a.topic, a.author, a.body, a.article_img_url, a.votes, a.created_at, a.article_id;`,
      [author, title, body, topic, article_img_url]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
exports.removeArticleById = (article_id) => {
  return db
    .query(`DELETE FROM articles WHERE article_id = $1 RETURNING *`, [
      article_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
    });
};

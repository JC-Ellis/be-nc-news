const db = require("../db/connection");

exports.fetchAllArticles = (sortBy, orderBy, topic) => {
  const allowedSortInputs = ["title", "author", "votes", "created_at"];
  const allowedOrderInputs = ["ASC", "DESC"];
  let queryString = `
        SELECT a.article_id, a.title, a.author, a.topic, a.created_at, a.votes, a.article_img_url, 
        COUNT(c.comment_id) 
        AS comment_count 
        FROM articles a 
        LEFT JOIN comments c 
        ON a.article_id = c.article_id `;

  let filterBy = [];

  if (topic) {
    filterBy.push(topic);
    queryString += `WHERE topic = $1 `;
  }
  if (sortBy) {
    if (!allowedSortInputs.includes(sortBy)) {
      return Promise.reject({ status: 400, msg: "bad request" });
    }
    queryString += `GROUP BY a.article_id ORDER BY a.${sortBy} `;
  } else {
    queryString += `GROUP BY a.article_id ORDER BY a.created_at `;
  }

  if (orderBy) {
    if (!allowedOrderInputs.includes(orderBy.toUpperCase())) {
      return Promise.reject({ status: 400, msg: "bad request" });
    }
    queryString += `${orderBy.toUpperCase()}`;
  } else {
    queryString += `DESC`;
  }
  console.log(queryString);
  return db.query(queryString, filterBy).then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticleById = (article_id) => {
  console.log(article_id);
  return db
    .query(`
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
      console.log(rows);
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

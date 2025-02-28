const db = require("../connection");
const format = require("pg-format");
const { convertTimestampToDate, createReferenceObject } = require("./utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query("DROP TABLE IF EXISTS comments")
    .then(() => {
      return db.query("DROP TABLE IF EXISTS articles");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS users");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS topics");
    })
    .then(() => {
      return createTopics();
    })
    .then(() => {
      return createUsers();
    })
    .then(() => {
      return createArticles();
    })
    .then(() => {
      return createComments();
    })
    .then(() => {
      const formattedTopicData = topicData.map((valueOf) => {
        return [valueOf.slug, valueOf.description, valueOf.img_url];
      });
      const insertTopicData = format(
        `
        INSERT INTO topics(slug, description, img_url)
        VALUES
        %L
        RETURNING *`,
        formattedTopicData
      );
      return db.query(insertTopicData);
    })
    .then(() => {
      const formattedUsersData = userData.map((valueOf) => {
        return [valueOf.username, valueOf.name, valueOf.avatar_url];
      });
      const insertUsersData = format(
        `
        INSERT INTO users(username, name, avatar_url)
        VALUES
        %L
        RETURNING *`,
        formattedUsersData
      );
      return db.query(insertUsersData);
    })
    .then(() => {
      // console.log(articleData)
      const formattedArticleData = articleData.map((valueOf) => {
        const articleDateFormat = convertTimestampToDate(valueOf);
        // console.log(articleDateFormat)
        return [
          articleDateFormat.title,
          articleDateFormat.topic,
          articleDateFormat.author,
          articleDateFormat.body,
          articleDateFormat.created_at,
          articleDateFormat.votes,
          articleDateFormat.article_img_url,
        ];
      });
      const insertArticleData = format(
        `
        INSERT INTO articles(title, topic, author, body, created_at, votes, article_img_url)
        VALUES
        %L
        RETURNING *`,
        formattedArticleData
      );
      return db.query(insertArticleData);
    })
    .then((response) => {
      // console.log('response.rows >>>', response.rows)
      const dataFromArticle = response.rows;

      const articleIdRef = createReferenceObject(
        dataFromArticle,
        "title",
        "article_id"
      );
      // console.log('articleIDRef', articleIdRef);
      const formattedCommentData = commentData.map((valueOf) => {
        const commentDateFormat = convertTimestampToDate(valueOf);
        return [
          articleIdRef[commentDateFormat.article_title],
          commentDateFormat.body,
          commentDateFormat.votes,
          commentDateFormat.author,
          commentDateFormat.created_at,
        ];
      });
      const insertUsersData = format(
        `
        INSERT INTO comments(article_id, body, votes, author, created_at)
        VALUES
        %L
        RETURNING *`,
        formattedCommentData
      );
      return db.query(insertUsersData);
    });
};

function createTopics() {
  return db.query(`CREATE TABLE topics(
    slug VARCHAR(100) PRIMARY KEY,
    description VARCHAR(300) NOT NULL,
    img_url VARCHAR(1000)
    );`);
}

function createUsers() {
  return db.query(`CREATE TABLE users(
    username VARCHAR(100) PRIMARY KEY,
    name VARCHAR(300) NOT NULL,
    avatar_url VARCHAR(1000)
    );`);
}

function createArticles() {
  return db.query(`CREATE TABLE articles(
    article_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    topic VARCHAR(200) REFERENCES topics(slug) ON DELETE CASCADE,
    author VARCHAR(200) REFERENCES users(username) ON DELETE CASCADE,
    body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    votes INT DEFAULT 0,
    article_img_url VARCHAR(1000)
    );`);
}

function createComments() {
  return db.query(`CREATE TABLE comments(
    comment_id SERIAL PRIMARY KEY,
    article_id INT REFERENCES articles(article_id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    votes INT DEFAULT 0,
    author VARCHAR(100) REFERENCES users(username) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
}

module.exports = seed;

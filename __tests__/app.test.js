const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const jestSorted = require("jest-sorted");
const app = require("../app");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const supertest = require("supertest");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: responds with an array of all topics, with the properties of: slug, description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topics = body.topics;
        expect(topics.length).toBe(3);
        expect(topics).toBeInstanceOf(Array);
        topics.forEach((topicVal) => {
          expect(typeof topicVal.slug).toBe("string");
          expect(typeof topicVal.description).toBe("string");
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: responds with a single article object matching the passed in article id number", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article.article_id).toBe(4);
        expect(article.author).toBe("rogersop");
        expect(article.title).toBe("Student SUES Mitch!");
        expect(article.body).toBe(
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages"
        );
        expect(article.topic).toBe("mitch");
        expect(article.created_at).toBe("2020-05-06T01:14:00.000Z");
        expect(article.votes).toBe(0);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
});

describe("GET /api/articles", () => {
  test("200: responds with an array of all articles, with the properties of: author, title, article_id, topic, created_at, votes, article_img_url, comment_count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).toBe(13);
        expect(articles).toBeInstanceOf(Array);
        articles.forEach((articleVal) => {
          expect(typeof articleVal.author).toBe("string");
          expect(typeof articleVal.title).toBe("string");
          expect(typeof articleVal.article_id).toBe("number");
          expect(typeof articleVal.topic).toBe("string");
          expect(typeof articleVal.created_at).toBe("string");
          expect(typeof articleVal.votes).toBe("number");
          expect(typeof articleVal.article_img_url).toBe("string");
          expect(typeof articleVal.comment_count).toBe("string");
        });
      });
  });
  test("200: responds with an array of all articles, sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET api/articles/:article_id/comments", () => {
  test("200: responds with an array of comments, matching the given article id", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        comments.forEach((commentVal) => {
          expect(commentVal.article_id).toBe(3);
          expect(typeof commentVal.comment_id).toBe("number");
          expect(typeof commentVal.votes).toBe("number");
          expect(typeof commentVal.body).toBe("string");
          expect(typeof commentVal.created_at).toBe("string");
          expect(typeof commentVal.author).toBe("string");
          expect(typeof commentVal.article_id).toBe("number");
        });
      });
  });
  test("200: responds with an array of comments sorted by most recent comment, matching the given article id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        console.log(comments)
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
});

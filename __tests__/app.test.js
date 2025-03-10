const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const jestSorted = require("jest-sorted")
const app = require("../app");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");

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

describe("Error handling", () => {
  test("404: responds with a 404 error if the user enters a wrong address", () => {
    return request(app)
      .get("/apr")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path not found");
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
  test("404: responds with not found if article_id doesn't exist", () => {
    return request(app)
      .get("/api/articles/999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("400: responds with bad request if passed in article_id is not a number", () => {
    return request(app)
      .get("/api/articles/thatoneplease")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
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
        // console.log(articles)
        expect(articles).toBeSortedBy("created_at", {descending: true})
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
});

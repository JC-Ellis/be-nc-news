const request = require("supertest");
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

describe("ERROR: default error handling", () => {
  test("404: responds with a 404 error if the user enters a wrong address", () => {
    return request(app)
      .get("/apr")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path not found");
      });
  });
});

describe("ERROR: /api/articles", () => {
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

describe("ERROR: api/articles/:article_id/comments", () => {
  test("404: responds with not found if article_id doesn't exist", () => {
    return request(app)
      .get("/api/articles/999999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("404: responds with not found if chosen article doesn't have any comments", () => {
    return request(app)
      .get("/api/articles/7/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("400: responds with bad request if passed in article_id is not a number", () => {
      return request(app)
        .get("/api/articles/whatsmitchdoinghere/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
});

describe("ERROR: api/articles/:article_id/comments", () => {
    test("404: responds with not found if article_id doesn't exist", () => {
        const newComment = {
            username: "lurker",
            body: "You shall not parse!"
          }
      return request(app)
        .get("/api/articles/999999/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("not found");
        });
    });
  });

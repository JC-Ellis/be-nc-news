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

describe("GET ERROR: default error handling", () => {
  test("404: responds with a 404 error if the user enters a wrong address", () => {
    return request(app)
      .get("/apr")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path not found");
      });
  });
});

describe("GET ERROR: /api/articles", () => {
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

describe("GET ERROR: api/articles/:article_id/comments", () => {
  test("404: responds with not found if article_id doesn't exist", () => {
    return request(app)
      .get("/api/articles/999999/comments")
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

describe("POST ERROR: api/articles/:article_id/comments", () => {
  test("404: responds with not found if article_id doesn't exist", () => {
    const newComment = {
      username: "lurker",
      body: "So, where's the article?",
    };
    return request(app)
      .post("/api/articles/999999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article or username not found");
      });
  });
  test("404: responds with not found if username doesn't exist", () => {
    const newComment = {
      username: "grandalf_the_tired",
      body: "You shall not parse!",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article or username not found");
      });
  });
  test("400: responds with bad request if passed in article_id is not a number", () => {
    const newComment = {
      username: "lurker",
      body: "At least it's not banana",
    };
    return request(app)
      .post("/api/articles/whyeven/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: responds with not found if username doesn't exist", () => {
    const newComment = {
      username: "lurker",
      body: "",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing required fields: comment or username");
      });
  });
});

describe("PATCH ERROR: api/articles/:article_id/", () => {
    test("404: responds with not found if article_id doesn't exist", () => {
        const newVotes = {
            inc_votes: 9,
          };
      return request(app)
        .patch("/api/articles/999999")
        .send(newVotes)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("article not found");
        });
    });
    test("400: responds with bad request if passed in article_id is not a number", () => {
        const newVotes = {
            inc_votes: 9,
          };
      return request(app)
        .patch("/api/articles/whydowedothistoourselves")
        .send(newVotes)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
    test("400: responds with bad request if inc_votes key is not a number", () => {
        const newVotes = {
            inc_votes: "it-is-a-banana",
          };
      return request(app)
        .patch("/api/articles/whydowedothistoourselves")
        .send(newVotes)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
});
describe("DELETE ERROR: api/comments/:comment_id", () => {
    test("404: responds with not found if comment_id doesn't exist", () => {
      return request(app)
        .delete("/api/comments/999999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("comment not found");
        });
    });
    test("400: responds with bad request if passed in comment_id is not a number", () => {
      return request(app)
        .delete("/api/comments/heseverywhere")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
  });
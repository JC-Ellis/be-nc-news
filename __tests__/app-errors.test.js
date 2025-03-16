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

describe("GET ERROR: /api/articles/:article_id", () => {
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

describe("GET ERROR: /api/articles/:article_id/comments", () => {
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

describe("POST ERROR: /api/articles/:article_id/comments", () => {
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
  test("400: responds with not found if comment body isn't given", () => {
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

describe("PATCH ERROR: /api/articles/:article_id/", () => {
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
      .patch("/api/articles/2")
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});
describe("GET ERROR: /api/articles?sort_by=VALUE&order=VALUE&topic=VALUE", () => {
  test("400: responds with bad request if sort_by VALUE isn't allowed", () => {
    return request(app)
      .get("/api/articles?sort_by=user_review")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: responds with bad request if order VALUE isn't allowed", () => {
    return request(app)
      .get("/api/articles?order=upways")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("404: responds with bad request if topic VALUE doesn't exist", () => {
    return request(app)
      .get("/api/articles?topic=motch")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
});
describe("GET ERROR: /api/users/:username", () => {
  test("404: responds with not found if username doesn't exist", () => {
    return request(app)
      .get("/api/users/toni-ravioli")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
});
describe("PATCH ERROR: api/comments/:comment_id", () => {
  test("404: responds with not found if comment_id doesn't exist", () => {
    const newVotes = {
      inc_votes: 9,
    };
    return request(app)
      .patch("/api/comments/999999")
      .send(newVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("comment not found");
      });
  });
  test("400: responds with bad request if passed in comment_id is not a number", () => {
    const newVotes = {
      inc_votes: 9,
    };
    return request(app)
      .patch("/api/comments/thereisnoescape")
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
      .patch("/api/comments/2")
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});
describe("POST ERROR: /api/articles", () => {
  test("404: responds with bad request if required field is empty", () => {
    const newArticle = {
      author: "icellusedkars",
      title: "",
      body: "my hunger does not define me",
      topic: "cats",
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };
    return request(app)
      .post("/api/articles/")
      .send(newArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Error: required field missing");
      });
  });
});
describe("POST ERROR: /api/topics", () => {
  test("404: responds with bad request if required field is empty", () => {
    const newTopic = {
      slug: "socks",
      title: "",
    };
    return request(app)
      .post("/api/topics/")
      .send(newTopic)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Error: required field missing");
      });
  });
});
describe("DELETE ERROR: /api/comments/:comment_id", () => {
  test("404: responds with an error message when trying to delete a non-existent comment", () => {
    return request(app)
      .delete("/api/comments/999999")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "comment not found" });
      });
  });

  test("400: responds with an error message for an invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/notanotherbanana")
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "bad request" });
      });
  });
});
describe("DELETE ERROR: /api/article/article_id", () => {
  test("404: responds with an error message when trying to delete a non-existent comment", () => {
    return request(app)
      .delete("/api/articles/999999")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "article not found" });
      });
  });

  test("400: responds with an error message for an invalid comment_id", () => {
    return request(app)
      .delete("/api/articles/notanotherbanana")
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "bad request" });
      });
  });
});
describe("GET ERROR /api/articles/ with pagination", () => {
  test("400: responds with bad request if LIMIT VALUE isn't allowed", () => {
    return request(app)
      .get("/api/articles?limit=loads")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: responds with bad request if page VALUE isn't allowed", () => {
    return request(app)
      .get("/api/articles?p=upways")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

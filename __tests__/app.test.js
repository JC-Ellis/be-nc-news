const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const jestSorted = require("jest-sorted");
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

describe("GET /api/topics", () => {
  test("200: responds with an array of all topics, with the properties of: slug, description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topics = body.topics;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
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
  test("200: responds with a single article object matching the passed in article id number, with a comment_count column", () => {
    return request(app)
      .get("/api/articles/6")
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article.comment_count).toBe("1");
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
        expect(articles.length).toBe(10);
        articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
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
        comments.forEach((comment) => {
          expect(comment.article_id).toBe(3);
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.article_id).toBe("number");
        });
      });
  });
  test("200: responds with an array of comments sorted by most recent comment, matching the given article id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: Responds with an empty array if there are no comments for a valid article_id.", () => {
    return request(app)
      .get("/api/articles/7/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments).toBeInstanceOf(Array);
        expect(comments.length).toBe(0);
      });
  });
});
describe("POST api/articles/:article_id/comments", () => {
  test("201: responds with the posted comment", () => {
    const newComment = {
      username: "lurker",
      body: "What an interesting article",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const comment = body.comment;
        expect(comment.article_id).toBe(3);
        expect(comment.body).toBe("What an interesting article");
        expect(comment.author).toBe("lurker");
        expect(typeof comment.comment_id).toBe("number");
        expect(typeof comment.votes).toBe("number");
        expect(typeof comment.created_at).toBe("string");
      });
  });
});
describe("PATCH api/articles/:article_id", () => {
  test("200: responds with an article matching the given article id, updated with a new vote count when given a positive integer", () => {
    const newVotes = {
      inc_votes: 9,
    };
    return request(app)
      .patch("/api/articles/6")
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article.votes).toBe(10);
        expect(article.article_id).toBe(6);
        expect(article.author).toBe("icellusedkars");
        expect(article.title).toBe("A");
        expect(article.topic).toBe("mitch");
        expect(article.created_at).toBe("2020-10-18T01:00:00.000Z");
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("200: responds with an article matching the given article id, updated with a new vote count when given a negative integer", () => {
    const newVotes = {
      inc_votes: -85,
    };
    return request(app)
      .patch("/api/articles/6")
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article.votes).toBe(-84);
        expect(article.article_id).toBe(6);
      });
  });
});
describe("DELETE api/comments/:comment_id", () => {
  test("204: deletes comment based on chosen comment id", () => {
    return request(app)
      .delete("/api/comments/6")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
});
describe("GET /api/users", () => {
  test("200: responds with an array of all users, with the properties of: username, name, avatar_url", () => {
    return request(app)
      .get("/api/users/")
      .expect(200)
      .then(({ body }) => {
        const users = body.users;
        users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200: responds with an user matching the given username, with the properties of: username, name, avatar_url", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        const user = body.user;
        expect(user.username).toBe("butter_bridge");
        expect(user.name).toBe("jonny");
        expect(user.avatar_url).toBe(
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
        );
      });
  });
});
describe("GET /api/articles?sort_by=VALUE&order=VALUE&topic=VALUE", () => {
  describe("/api/articles/ with with one added query", () => {
    test("200: responds with array of articles sorted by input parameter, in descending order by default", () => {
      return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect(articles).toBeSortedBy("author", { descending: true });
        });
    });
    test("200: responds with an array of all articles, sorted by date by default, in ascending order", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect(articles).toBeSortedBy("created_at", { descending: false });
        });
    });
    test("200: responds with array of articles filtered by topic", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect(articles.length).toBe(10);
          articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
          });
        });
    });
    test("Responds with an empty array when request query is for a topic that doesn't have any associated articles", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect(articles).toBeInstanceOf(Array);
          expect(articles.length).toBe(0);
        });
    });
  });
  describe("GET /api/articles/ with with two added queries", () => {
    test("200: responds with an array of all articles, sorted by given input, in ascending order", () => {
      return request(app)
        .get("/api/articles?sort_by=author&order=asc")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect(articles).toBeSortedBy("author", { descending: false });
        });
    });
  });
});
describe("GET /api/articles/ with with three added queries", () => {
  test("200: responds with array of articles filtered by topic, and sorted by author in ascending order", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=asc&topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeSortedBy("author", { descending: false });
        expect(articles.length).toBe(10);
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
});
describe("PATCH api/comments/:comment_id", () => {
  test("200: responds with a comment matching the given comment id, updated with a new vote count when given a positive integer", () => {
    const newVotes = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/comments/2")
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        const comment = body.comment;
        expect(comment.votes).toBe(15);
        expect(comment.comment_id).toBe(2);
        expect(comment.author).toBe("butter_bridge");
        expect(comment.body).toBe(
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky."
        );
        expect(comment.created_at).toBe("2020-10-31T03:03:00.000Z");
      });
  });
  test("200: responds with a comment matching the given comment id, updated with a new vote count when given a negative integer", () => {
    const newVotes = {
      inc_votes: -1,
    };
    return request(app)
      .patch("/api/comments/2")
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        const comment = body.comment;
        expect(comment.votes).toBe(13);
        expect(comment.comment_id).toBe(2);
      });
  });
});
describe("POST api/articles/", () => {
  test("201: responds with the newly posted article", () => {
    const newArticle = {
      author: "icellusedkars",
      title: "Why am I so hungy?",
      body: "my hunger does not define me",
      topic: "cats",
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };
    return request(app)
      .post("/api/articles/")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        const article = body.article;
        expect(article.article_id).toBe(14);
        expect(article.author).toBe("icellusedkars");
        expect(article.title).toBe("Why am I so hungy?");
        expect(article.body).toBe("my hunger does not define me");
        expect(article.topic).toBe("cats");
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
        expect(article.comment_count).toBe("0");
        expect(article.votes).toBe(0);
        expect(typeof article.created_at).toBe("string");
      });
  });
  test("201: Responds with the newly posted article. If article_img_url is not provided, it defaults to a predefined value.", () => {
    const newArticle = {
      author: "icellusedkars",
      title: "Why am I so hungy?",
      body: "my hunger does not define me",
      topic: "cats",
    };
    return request(app)
      .post("/api/articles/")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        const article = body.article;
        expect(article.article_id).toBe(14);
        expect(article.author).toBe("icellusedkars");
        expect(article.title).toBe("Why am I so hungy?");
        expect(article.body).toBe("my hunger does not define me");
        expect(article.topic).toBe("cats");
        expect(article.article_img_url).toBe("no image added");
        expect(typeof article.comment_count).toBe("string");
        expect(typeof article.votes).toBe("number");
        expect(typeof article.created_at).toBe("string");
      });
  });
});
describe("POST api/topics/", () => {
  test("201: responds with the newly posted topic", () => {
    const newTopic = {
      slug: "programming",
      description: "computers and stuff?",
    };
    return request(app)
      .post("/api/topics/")
      .send(newTopic)
      .expect(201)
      .then(({ body }) => {
        const topic = body.topic;
        expect(topic.slug).toBe("programming");
        expect(topic.description).toBe("computers and stuff?");
      });
  });
});
describe("DELETE api/articles/:article_id", () => {
  test("204: deletes article based on chosen article id", () => {
    return request(app)
      .delete("/api/articles/6")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
});
describe("GET /api/articles/ with pagination", () => {
  test("200: responds with an array of all articles, with a set limit, and a count of all articles, starting at the first page by default", () => {
    return request(app)
      .get("/api/articles?limit=8")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).toBe(8);
        articles.forEach((article) => expect(article.total_count).toBe("13"));
      });
  });
  test("200: responds with an array of all articles, with a set limit, starting from the second set of articles", () => {
    return request(app)
      .get("/api/articles?limit=4&p=2")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).toBe(4);
        articles.forEach((article) => expect(article.total_count).toBe("13"));
      });
  });
  test("200: responds with an array of all articles, with a default limit of 10", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).toBe(10);
      });
  });
  test("200: responds with an array of all articles with a topic of mitch, sorted by author, in ascending order with a limit of 3, starting at page 3", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=asc&topic=mitch&limit=3&p=3")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).toBe(3);
        expect(articles).toBeSortedBy("author", { descending: false });
        expect(articles[0].article_id).toBe(8);
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
          expect(article.total_count).toBe("12");
        });
      });
  });
  test("200: returns an empty array when given a page exceeding the amount available", () => {
    return request(app)
      .get("/api/articles?p=9999999")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBe(0);
      });
  });
});
describe("GET /api/articles/article_id/comments with pagination", () => {
  test("200: responds with an array of comments, filtered by article id, with a set limit, starting at the first page by default", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=8")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments[0].comment_id).toBe(5);
        expect(comments.length).toBe(8);
        comments.forEach((comment) => expect(comment.article_id).toBe(1));
      });
  });
  test("200: responds with an array of comments, filtered by article id, with a set limit, starting from the second page", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=4&p=2")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments.length).toBe(4);
        expect(comments[0].comment_id).toBe(7);
        comments.forEach((comment) => expect(comment.article_id).toBe(1));
      });
  });
  test("200: responds with an array of comments, filtered by article id, with a default limit of 10, starting from the first page", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments.length).toBe(10);
        expect(comments[0].comment_id).toBe(5);
        comments.forEach((comment) => expect(comment.article_id).toBe(1));
      });
  });
});

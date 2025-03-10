// supertest, app and endpoints
const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../app");
// seed, databases and data
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");

//jest-sorted perhaps

/* Set up your beforeEach & afterAll functions here */
beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of all topics, with the properties of: slug, description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topics = body.topics;
        expect(topics.length).toBe(3);
        topics.forEach((topicVal) => {
          expect(typeof topicVal.slug).toBe("string");
          expect(typeof topicVal.description).toBe("string");
        });
      });
  });
  test("404: responds with a 404 error if the user enters a wrong address", () => {
    return request(app)
      .get("/api/topic")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path not found");
      });
  });
});

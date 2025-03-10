const app = require("../app");
const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
require("jest-sorted");

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
        expect(endpoints["GET /api"].description).toEqual(
          "serves up a json representation of all the available endpoints of the api"
        );
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topics object, and should have the right property", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.length).toBeGreaterThan(0);
        article.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test("404: Responds with not found when passing the wrong path", () => {
    return request(app)
      .get("/api/nonvalid")
      .expect(404)
      .then((body) => {
        expect(body.notFound).toBe(true);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with the appropriate article in the database", () => {
    return request(app)
      .get("/api/articles/6")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveLength(1);
        expect(body[0].article_id).toBe(6);
        expect(body[0]).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("404: Responds with a not found message when queried an article_id that is not in the database", () => {
    return request(app)
      .get("/api/articles/600")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article not found");
      });
  });
  test("400: Responds with a bad request when queried an invalid character as article_id", () => {
    return request(app)
      .get("/api/articles/string")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});
describe("GET /api/articles", () => {
  test("200: Responds with an array of article object, and should have the right property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        console.log(body, "body from test");
        expect(body.length).toBeGreaterThan(0);
        body.forEach((art) => {
          expect(art).toMatchObject({
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("200: Responds with an array of article object, and should be sorted by date descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBeGreaterThan(0);
        const dateSorted = [];
        body.filter((art) => dateSorted.push(art.created_at));
        expect(dateSorted).toBeSorted({ descending: true });
      });
  });

  test("404: Responds with not found when passing the wrong path", () => {
    return request(app)
      .get("/api/nonvalid")
      .expect(404)
      .then((body) => {
        expect(body.notFound).toBe(true);
      });
  });
  test("200: responds with an empty array if no articles exist", () => {
    return db.query("DELETE FROM articles").then(() => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual([]);
        });
    });
  });
});
